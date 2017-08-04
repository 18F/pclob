const assert = require('assert');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const toMarkdown = require('to-markdown');
const jsonStringify = require('json-stable-stringify');
const yaml = require('js-yaml');
const chalk = require('chalk');

const ROOT_DIR = path.join(__dirname, 'scraped');
const ROOT_ASSETS_DIR = path.normalize(path.join(__dirname, '..'));
const DATE_RE = /(January|February|March|April|May|June|July|August|September|October|November|December) (\d+), 20(\d\d)/;
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
const ENDS_WITH_OPEN_PAREN_RE = /(\(\s*)$/;
const STARTS_WITH_CLOSE_PAREN_RE = /^(\s*\))/;
const ZERO_WIDTH_SPACE_RE = /\u200B/g;
const WARNING = chalk.yellow('WARNING:');

// https://gist.github.com/mathewbyrne/1280286
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function htmlToMarkdown(html) {
  // By default toMarkdown converts content to markdown that's inside
  // raw HTML, e.g. `<td>[linky](http://example.org/)</td>`. However,
  // Jekyll's Markdown parser doesn't like this--it will render all
  // content inside raw HTML tags as raw HTML. So we'll provide a converter
  // that ensures that such content doesn't get converted to Markdown.
  return toMarkdown(html, {
    converters: [{
      filter(node) {
        while (node.parentNode) {
          node = node.parentNode;
          if (['TD', 'TH'].includes(node.nodeName)) {
            return true;
          }
        }
        return false;
      },
      replacement(innerHTML, node) {
        return node.cloneNode(true).outerHTML;
      }
    }]});
}

function relativeUrlToAbsolutePath(rootDir, url) {
  const parts = [rootDir].concat(decodeURIComponent(url).split('/'));
  return path.join.apply(path, parts);
}

function getHtmlPage(relUrl) {
  const abspath = relativeUrlToAbsolutePath(ROOT_DIR, relUrl);
  const html = fs.readFileSync(abspath, 'utf-8')
    .replace(ZERO_WIDTH_SPACE_RE, '');
  return cheerio.load(html);
}

function parseDate(text) {
  const match = DATE_RE.exec(text);
  const month = MONTHS.indexOf(match[1]);
  const day = parseInt(match[2]);
  const year = 2000 + parseInt(match[3]);

  assert(month >= 0);
  return new Date(year, month, day);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function getFirstDate(text) {
  const match = DATE_RE.exec(text);

  return match && match[0];
}

function findParenthesizedLinks($p) {
  return $p.find('a').filter(function() {
    const prev = this.previousSibling;
    const next = this.nextSibling;
    return (
      (prev && prev.nodeType === 3 &&
       ENDS_WITH_OPEN_PAREN_RE.test(prev.nodeValue)) &&
      (next && next.nodeType === 3 &&
       STARTS_WITH_CLOSE_PAREN_RE.test(next.nodeValue))
    );
  });
}

function removeParenthesizedLinks($links) {
  $links.each(function() {
    const p = this.previousSibling;
    const n = this.nextSibling;

    p.nodeValue = p.nodeValue.replace(ENDS_WITH_OPEN_PAREN_RE, '');
    n.nodeValue = n.nodeValue.replace(STARTS_WITH_CLOSE_PAREN_RE, '');
  });
  $links.remove();
}

function removePrevSiblings($, node) {
  while (node.previousSibling) {
    $(node.previousSibling).remove();
  }
}

function isAbsoluteUrl(url) {
  return /^https?:\/\//.test(url);
}

function fixupLinks($, $el, filename, permalinks) {
  const currWebPath = path.posix.dirname(filename);

  $el.find('img').each(function() {
    const src = $(this).attr('src');
    let webPath = path.posix.normalize(path.posix.join(currWebPath, src));

    // We've only got a few images to process, and we can re-point them
    // to their new locations in the new site.
    if (webPath === 'media/medine.png') {
      webPath = 'assets/img/board/members/medine.png';
    } else {
      const match = webPath.match(/^media\/coversheets\/(.+)$/);
      if (match) {
        webPath = `assets/img/coversheets/${match[1]}`;
      }
    }

    if (!fs.existsSync(relativeUrlToAbsolutePath(ROOT_ASSETS_DIR, webPath))) {
      const msg = `Image target in '${filename}' not found: ${webPath}`;
      console.log(WARNING, msg);
    }
    $(this).attr('src', `{{site.baseurl}}/${webPath}`);
  });

  $el.find('a[href]').each(function() {
    const href = $(this).attr('href');

    if (isAbsoluteUrl(href)) {
      if (/pclob\.gov/i.test(href)) {
        throw new Error(`Unexpected pclob.gov URL found: ${href}`);
      }
      return;
    }

    const webPath = path.posix.normalize(path.posix.join(currWebPath, href));

    if (permalinks.has(`/${webPath}`)) {
      return;
    }

    if (!fs.existsSync(relativeUrlToAbsolutePath(ROOT_ASSETS_DIR, webPath))) {
      const msg = `Link target in '${filename}' not found: ${webPath}`;
      console.log(WARNING, msg);
    }
    $(this).attr('href', `{{site.baseurl}}/${webPath}`);
  });
}

function extractItems(filename, permalinks) {
  const $ = getHtmlPage(filename);

  return $('p strong').map(function() {
    const $p = $(this).closest('p');
    const title = $(this).text();
    let date = getFirstDate($p.text());
    let titleHref = $p.find('strong a').attr('href') ||
                    $p.find('a strong').closest('a').attr('href');

    if (!/\.html$/.test(titleHref)) titleHref = null;

    const $parenLinks = findParenthesizedLinks($p);
    const links = $parenLinks.filter(function() {
      return $(this).attr('href') !== titleHref;
    }).map(function() {
      const href = $(this).attr('href');

      return {
        text: $(this).text().trim(),
        url: isAbsoluteUrl(href) ? href : `/${href}`,
      };
    }).get();
    const section = $p.prevAll('h1, h2, h3, h4, h5, h6').first().text();
    const firstBr = $p.find('br').first().get(0);
    let markdown = null;
    let permalink = null;

    // If the title links to an HTML page, fetch its content and
    // convert it to markdown.
    if (titleHref) {
      const $page = getHtmlPage(titleHref);
      const $content = $page('#page-content');

      fixupLinks($page, $content, titleHref, permalinks);

      markdown = htmlToMarkdown($content.html()).trim();
      permalink = `/${titleHref}`;
      permalinks.add(permalink);
    }

    fixupLinks($, $p, filename, permalinks);

    // Now clean up the paragraph so we can convert it to markdown.
    removeParenthesizedLinks($parenLinks);

    if (firstBr) {
      removePrevSiblings($, firstBr);
      $(firstBr).remove();
    }

    const description = htmlToMarkdown($p.html())
      .trim()
      .split('\n')
      .filter(line => {
        line = line.trim();
        const match = DATE_RE.exec(line);

        // If a line consists *solely* of a date, then it's probably a
        // more accurate date than the first date we found in the whole
        // paragraph, so use it instead.
        if (match && match[0] === line) {
          date = match[0];
          return false;
        }
        return true;
      })
      .join('\n');

    return {
      title,
      date,
      links,
      markdown,
      description,
      section,
      permalink,
    }
  }).get();
}

module.exports = {
  getHtmlPage,
  extractItems,
};

if (!module.parent) {
  const permalinks = new Set();
  [
    {filename: 'newsroom.html', isCollection: true},
    {filename: 'library.html', isCollection: false},
    {filename: 'events.html', isCollection: true},
  ].forEach(({filename, isCollection}) => {
    const items = extractItems(filename, permalinks);
    const basename = path.basename(filename, '.html');

    if (isCollection) {
      const collection = `_${basename}`;
      const collectionDir = path.join(ROOT_ASSETS_DIR, collection);

      if (!fs.existsSync(collectionDir)) {
        fs.mkdirSync(collectionDir);
      }

      items.forEach((item, i) => {
        const frontMatter = JSON.parse(JSON.stringify(item));
        let content = frontMatter['markdown'];
        delete frontMatter['markdown'];
        if (!content) {
          content = frontMatter['description'];
          delete frontMatter['description'];
        }

        assert(content);
        assert(frontMatter['date']);
        assert(frontMatter['title']);

        const date = toIsoDate(parseDate(frontMatter['date']));

        frontMatter['date'] = date;
        frontMatter['layout'] = 'news-or-event';

        const slug = slugify(frontMatter['title']);
        const outfile = `${date}-${slug}.md`;
        const yamlFrontMatter = yaml.safeDump(frontMatter, {
          sortKeys: true,
        });

        console.log(`Writing ${collection}/${outfile}.`);
        fs.writeFileSync(
          path.join(ROOT_ASSETS_DIR, collection, outfile),
          `---\n${yamlFrontMatter}---\n${content}\n`
        );
      });
    } else {
      const outfile = `${basename}.yaml`;
      console.log(`Writing _data/${outfile}.`);

      items.forEach(item => {
        ['markdown', 'permalink'].forEach(key => {
          assert(!item[key]);
          delete item[key];
        });
        if (item['date']) {
          item['date'] = toIsoDate(parseDate(item['date']));
        }
      });

      fs.writeFileSync(path.join(ROOT_ASSETS_DIR, '_data', outfile),
                       yaml.safeDump(items, {sortKeys: true}));
    }
  });
}

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const toMarkdown = require('to-markdown');
const jsonStringify = require('json-stable-stringify');

const ROOT_DIR = path.join(__dirname, 'scraped');
const ROOT_ASSETS_DIR = path.normalize(path.join(__dirname, '..'));
const DATE_RE = /(January|February|March|April|May|June|July|August|September|October|November|December) (\d+), 20(\d\d)/;
const ENDS_WITH_OPEN_PAREN_RE = /(\(\s*)$/;
const STARTS_WITH_CLOSE_PAREN_RE = /^(\s*\))/;
const ZERO_WIDTH_SPACE_RE = /\u200B/g;

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
      console.log('WARNING:', msg);
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

      markdown = toMarkdown($content.html()).trim();
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

    const description = toMarkdown($p.html())
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
    'newsroom.html',
    'library.html',
    'events.html',
  ].forEach(filename => {
    const items = extractItems(filename, permalinks);
    const outfile = `extracted-${path.basename(filename, '.html')}.json`;
    console.log(`Writing _data/${outfile}.`);
    fs.writeFileSync(path.join(__dirname, '..', '_data', outfile),
                     jsonStringify(items, {space: '  '}));
  });
}

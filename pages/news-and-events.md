---
layout: page
permalink: /newsroom/
---

# Events and press

{% for post in site.posts %}
  <h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
  <p><em>{{ post.date | date: "%B %e, %Y" }}</em></p>

  {% comment %}
  This project does excerpts a bit unusually, in that some legacy posts might
  have an 'excerpt' defined in their YAML front matter. If that's the case,
  Jekyll will set page.excerpt to this value, but it won't convert it from
  Markdown to HTML. So here we'll check to see if the first character of the
  excerpt is the opening of an HTML tag; if it is, that means it's already been
  converted to HTML.
  {% endcomment %}

  {% assign first_char = post.excerpt | truncate: 1, '' %}
  {% if first_char == '<' %}
  {{ post.excerpt }}
  {% else %}
  {{ post.excerpt | markdownify }}
  {% endif %}

  <a href="{{ post.url | prepend: site.baseurl }}">Read more<span class="usa-sr-only"> about {{ post.title }}</span> &raquo;</a>
{% endfor %}

---
layout: page
title: Events and press
permalink: /newsroom/
---
{% comment %}
The news and events section uses Jekyll's built-in "post" type, which gives us
some things for free that we couldn't get otherwise, like pagination. 

To create a new news or event, simply create a new post in _posts and fill in
the relevant front matter.

For more,
see here: https://jekyllrb.com/docs/posts/
{% endcomment %}

{% for post in site.posts %}
<div class="post">
{% if post.category == 'newsroom' %}
<p class="label post--label {{ post.category }}">Filed in News</p>
{% else if post.category == 'events' %}
<p class="label post--label {{ post.category }}">Filed in Events</p>
{% endif %}
<p class="post--date">{{ post.date | date: "%B %e, %Y" }}</p>
<h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>

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

  <a class="post--article-link" href="{{ post.url | prepend: site.baseurl }}">Read more<span class="usa-sr-only"> about {{ post.title }}</span> &raquo;</a>
{% endfor %}
</div>

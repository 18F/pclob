---
layout: page
permalink: /newsroom/
---

# Events and press

{% assign entries = site.newsroom | concat: site.events | sort: 'date' | reverse %}
{% for entry in entries %}
  <h3><a href="{{ entry.url }}">{{ entry.title }}</a></h3>
  <p><em>{{ entry.date | date: "%B %e, %Y" }}</em></p>
  {% if entry.description %}
  {{ entry.description | markdownify }}
  {% else %}
  {{ entry.content | markdownify }}
  {% endif %}
  <a href="{{ entry.url }}">Read more<span class="usa-sr-only"> about {{ entry.title }}</span> &raquo;</a>
{% endfor %}

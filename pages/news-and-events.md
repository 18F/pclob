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
  <p>{{ entry.description | markdownify }}</p>
  {% else %}
  <p>{{ entry.content | markdownify }}</p>
  {% endif %}
{% endfor %}

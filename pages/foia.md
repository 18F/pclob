---
layout: page
title: Freedom of Information Act (FOIA)
permalink: /foia/
documents:
  - title: FOIA Reference Guide
    description: |
      This reference guide is designed to help the public understand how the PCLOB FOIA process works so that the public can be better informed about the operations and activities of the Federal Government.
    downloads:
      - type: PDF
        url: /assets/files/InterimFOIAReferenceGuide.pdf
  - title: 2017 Chief FOIA Officer Report
    description: |
      This is the PCLOB's third Chief Freedom of Information Act Officer Report, which covers activities from March 2016 through March 2017.
    downloads:
      - type: PDF
        url: /assets/files/FOIA-2017-Chief_FOIA_Officer_Report.pdf
  - title: 2016 Chief FOIA Officer Report
    description: |
      This is the PCLOB's second Chief Freedom of Information Act Officer Report, which covers activities from March 2015 through March 2016.
    downloads:
      - type: PDF
        url: /assets/files/FOIA-2016-Chief_FOIA_Officer_Report.pdf
  - title: Annual Freedom of Information Act Report for FY 2016
    description: |
      This is the PCLOB's third Annual Freedom of Information Act Report, which covers activities from October 1, 2015 – September 30, 2016.
    downloads:
      - type: PDF
        url: /assets/files/FOIA-FY16-AnnualReport.pdf
      - type: XML
        url: /assets/foia/annual/PCLOB.FY16.Final.xml
      - type: CSV
        url: /assets/foia/annual/Raw-Data-Elements.csv

---
## Requests

FOIA requests may be directed to the Board at:

**Email:** foia@pclob.gov

**Fax:** (202) 296-4395

## Documents

{% for doc in page.documents %}
  <h3>{{ doc.title }}</h3>
  <p>{{ doc.description }}</p>
  <ul>
  {% for download in doc.downloads %}
    <li><a href="{{ download.url }}">Download {{ download.type }}</a></li>
  {% endfor %}
  </ul>
{% endfor %}

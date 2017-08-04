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
        url: /foia/FOIA%20Library/InterimFOIAReferenceGuide.pdf
  - title: 2017 Chief FOIA Officer Report
    description: |
      This is the PCLOB's third Chief Freedom of Information Act Officer Report, which covers activities from March 2016 through March 2017.
    downloads:
      - type: PDF
        url: /library/FOIA-2017-Chief_FOIA_Officer_Report.pdf
  - title: 2016 Chief FOIA Officer Report
    description: |
      This is the PCLOB's second Chief Freedom of Information Act Officer Report, which covers activities from March 2015 through March 2016.
    downloads:
      - type: PDF
        url: /library/FOIA-2016-Chief_FOIA_Officer_Report.pdf
  - title: Annual Freedom of Information Act Report for FY 2016
    description: |
      This is the PCLOB's third Annual Freedom of Information Act Report, which covers activities from October 1, 2015 – September 30, 2016.
    downloads:
      - type: PDF
        url: /library/FOIA-FY16-AnnualReport.pdf
      - type: XML
        url: /foia/annual/PCLOB.FY16.Final.xml
      - type: CSV
        url: /foia/annual/Raw-Data-Elements.csv
  - title: Annual Freedom of Information Act Report for FY 2015
    description: |
      This is the PCLOB's second Annual Freedom of Information Act Report, which
      covers activities from October 1, 2014 – September 30, 2015.
    downloads:
      - type: PDF
        url: /library/FOIA-FY15-AnnualReport.pdf
      - type: XML
        url: /foia/annual/PCLOB.FY15.Final.xml
  - title: 2015 Chief FOIA Officer Report
    description: |
      This is the PCLOB's first Chief Freedom of Information Act Officer Report,
      which covers activities from March 2014 through March 2015.
    downloads:
      - type: PDF
        url: /library/FOIA-2015-Chief_FOIA_Officer_Report.pdf
  - title: Annual Freedom of Information Act Report for FY 2014
    description: |
      This is the PCLOB's first Annual Freedom of Information Act Report, which
      covers activities from October 1, 2013-September 30, 2014.
    downloads:
      - type: PDF
        url: /library/FOIA-FY14-AnnualReport.pdf
      - type: XML
        url: /foia/annual/PCLOB.FY14.Final.xml
quarterly_reports:
  # Note that the quarters should be listed in reverse chronological
  # order. If they're not, they will be mis-labeled!
  - year: FY 2017
    quarters:
      - /foia/quarterly/PCLOB-2017-Q2.zip
      - /foia/quarterly/PCLOB-2017-Q1.zip
  - year: FY 2016
    quarters:
      - /foia/quarterly/PCLOB-2016-Q4.zip
      - /foia/quarterly/PCLOB-2016-Q3.zip
      - /foia/quarterly/PCLOB-2016-Q2.zip
      - /foia/quarterly/PCLOB-2016-Q1.zip
  - year: FY 2015
    quarters:
      - /foia/quarterly/PCLOB-2015-Q4.zip
      - /foia/quarterly/PCLOB-2015-Q3.zip
      - /foia/quarterly/PCLOB-2015-Q2.zip
      - /foia/quarterly/PCLOB-2015-Q1.zip

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
    <li><a href="{{ download.url | prepend: site.baseurl }}">Download {{ download.type }}</a></li>
  {% endfor %}
  </ul>
{% endfor %}

## Quarterly Reports

{% for report in page.quarterly_reports %}
  <h3>{{ report.year }}</h3>
  <ul>
    {% for url in report.quarters %}
    <li><a href="{{ url | prepend: site.baseurl }}">Download <span class="usa-sr-only">{{ report.year }}</span> quarter {{ report.quarters | size | minus: forloop.index0 }} data (XML)</a></li>
    {% endfor %}
  </ul>
{% endfor %}

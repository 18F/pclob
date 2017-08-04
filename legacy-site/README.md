This directory contains many of the HTML files from the legacy site,
as retrieved by [HTTrack](https://www.httrack.com/).

It contains a script that extracts structured data from the legacy HTML
and writes it into the new Jekyll-based site.

Eventually, once the extractor has stabilized and the extracted files
have a life of their own, this directory should be removed from the
repository.

To run the extractor, `cd` into this directory and run:

```
npm install
node extract-data.js
```

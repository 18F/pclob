# Privacy and Civil Liberties Oversight Board website

This is a Jekyll project for the new Privacy and Civil Liberties Oversight
Board (PCLOB) website.

This site is made for use with the
[Federalist](https://github.com/18f/federalist) in mind.

## Running the site with Docker

If you don't want to have to deal with making sure that you have the
proper versions of dependencies installed, you can use Docker instead. It
takes care of all the dependencies for you, and provides an environment
similar to the one which Federalist builds your site on.

1. Install [Docker Community Edition][].
1. Clone the repository.
1. Run `docker-compose up`.
1. Visit the local site at [http://localhost:4000/dev/](http://localhost:4000/dev/)

If you ever decide that you no longer want to use Docker, run
`docker-compose down -v` to properly clean everything up.

For extra configuration options, copy `.env.sample` to `.env` and edit it
as needed.

[Docker Community Edition]: https://www.docker.com/community-edition

## Running the link checker

To make sure the site doesn't have any 404s or other consistency issues,
run:

```
npm install
npm test
```

## Upgrading USWDS

This project uses the CSS and JavaScript from [U.S. Web Design System](https://standards.18f.gov).

To update the version of the system, [download the code](https://standards.usa.gov/getting-started/download/) from the website. Unzip the download and drop the entire folder (which should be named something like `uswds-1.3.0`) into `assets/vendor`.

In your `_config.yml`, update the `wds-version` value to the new version number. This should match the version number in the name of the folder you just downloaded. In the case of our example, it would look like this: `wds-version: 1.3.0`. You'll need to restart your Jekyll server to see the new code take effect.

## 18F Open Source Policy

This repository contains the official [Open Source Policy](policy.md) of [18F](https://18f.gsa.gov/) (a digital delivery team within the [General Services Administration](http://gsa.gov)).

**[Read 18F's Open Source Policy.](policy.md)**

### 18F Team Guidance

For 18F team members, we have guidance on how 18F puts this policy into practice, and how we handle the narrow situations where we may delay or withhold the release of source code.

**[18F's open source team practices.](practice.md)**

### Credits

This policy was originally forked from the [Consumer Financial Protection Bureau's policy](https://github.com/cfpb/source-code-policy). Thanks also to [@benbalter](https://github.com/benbalter) for his [insights regarding CFPB's initial policy](http://ben.balter.com/2012/04/10/whats-missing-from-cfpbs-awesome-new-source-code-policy/).

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

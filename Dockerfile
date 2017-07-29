FROM ruby:2.3

# Jekyll sites often need Node for various things, so we'll install it.
# Note that Federalist also supports Node, so this just helps recreate
# same environment used when building the site there.

# https://nodejs.org/en/download/package-manager/

RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs zip

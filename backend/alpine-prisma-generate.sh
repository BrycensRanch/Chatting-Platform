#!/bin/bash

# https://github.com/prisma/prisma/issues/6603#issuecomment-1084401475

if [ -x "node_modules/prisma" ]
then
  pnpm prisma generate
else
  # for multistage docker build, dev deps won't be installed in production mode
  pnpm dlx $(pnpm list --depth 0 --dev --parseable | grep -o -m 1 'prisma@[0-9]\+\.[0-9]\+\.[0-9]\+$' ) generate
fi

# link to store from package node_modules because weird TS path resolution quirks
rm -rf node_modules/.prisma && mkdir node_modules/.prisma
ln -s $(realpath node_modules/@prisma/client/../../)/.prisma/client node_modules/.prisma/client
exit 0
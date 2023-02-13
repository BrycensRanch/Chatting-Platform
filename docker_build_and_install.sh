#!/bin/bash -x

# Precompiled builds?!?!
arr=("$PWD/frontend/.next" "$PWD/backend/dist")
for d in "${arr[@]}"; do
    if [ -d "$d"]; then
        echo "Using detected precompiled builds, woo!"
    else
        echo "Shame on you, you didn't compile builds before building this Dockerfile, enjoy the INCREASED image size and build times." && NODE_ENV=development HUSKY=0 CYPRESS_INSTALL_BINARY=0 pnpm install && pnpm build && pnpm prune --prod --no-optional && exit 0
    fi
done
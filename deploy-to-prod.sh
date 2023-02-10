#!/bin/bash
# im so close to COMMITTING MY PASSWORD!!

if [[ "$1" == "beta" ]]; then
    server='user@beta_server'
else
    server='romvnly@159.89.240.214'
fi
GIT_URL=$(git config --get remote.origin.url)
GIT_SHORT_ID=$(git rev-parse --short HEAD)
PROD_PATH="/home/romvnly/$GIT_SHORT_ID"
EXCLUDED_FILES="--exclude=.git --exclude=**/node_modules --exclude=**/dist --exclude=**/build --exclude=**/out --exclude=**/coverage --exclude=**/PostgresData --exclude=**/PostgresData2 --exclude=**/cypress"

# ssh $server "su romvnly -c \"rm -rf $PROD_PATH && git clone $GIT_URL $PROD_PATH >/dev/null 2>&1 && cd $PROD_PATH && npm install && npm run start:pm2\""
rsync -az --progress -I "romvnly@159.89.240.214":"$PROD_PATH" $EXCLUDED_FILES $PWD
# ssh "root@159.89.240.214" -t "pm2 startup"
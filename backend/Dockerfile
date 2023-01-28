# https://github.com/smartiniOnGitHub/fastify-example/blob/master/Dockerfile.alpine
# Word for word, bar for bar lmfao

# Image where Node 18 (LTS) alpine + git + ssh is installed
FROM timbru31/node-alpine-git:hydrogen AS init 

# update packages, to reduce risk of vulnerabilities
RUN apk update && apk upgrade
RUN apk add --no-cache bash
RUN apk add --no-cache libc6-compat
# RUN apk cache clean

# set a non privileged user to use when running this image
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# set right (secure) folder permissions
RUN mkdir -p /home/nodejs/app/node_modules && chown -R nodejs:nodejs /home/nodejs/app
RUN mkdir -p /home/nodejs/.npm-global
RUN chown -R nodejs:nodejs /home/nodejs/.npm-global

USER nodejs
WORKDIR /home/nodejs/app

# set default node env
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=production
ENV NPM_CONFIG_PREFIX=/home/nodejs/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/nodejs/.npm-global/bin 

ENV NPM_CONFIG_LOGLEVEL=error

# Install dependencies based on the preferred package manager
COPY --chown=nodejs:nodejs package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY --chown=nodejs:nodejs node_modules ./node_modules
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts --no-audit --progress=false --prefer-offline; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY --chown=nodejs:nodejs dist ./
# Repetitive, ik. For compatability reasons
COPY --chown=nodejs:nodejs dist ./dist

# COPY --chown=nodejs:nodejs healthCheck.js .
COPY --chown=nodejs:nodejs .env ./.env
# Technically, this file is already on the system, but this is just for consistency's sake
COPY --chown=nodejs:nodejs pm2.config.js .

# Work in progress, this can cause mismatched global dependencies
RUN npm i -g typescript pm2 rimraf --no-audit --progress=false --prefer-offline
RUN npm i prisma @prisma/client --no-audit --progress=false --prefer-offline
RUN npx prisma generate

EXPOSE 8000

ENV PORT 8000

# CMD [ "npm", "start" ]
CMD [ "pm2-runtime", "start", "pm2.config.js" ]

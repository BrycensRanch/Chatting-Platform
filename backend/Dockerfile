# https://github.com/smartiniOnGitHub/fastify-example/blob/master/Dockerfile.alpine
# Word for word, bar for bar lmfao

# Image where Node 18 (LTS) alpine + git + ssh is installed
FROM timbru31/node-alpine-git:hydrogen

# update packages, to reduce risk of vulnerabilities
RUN apk update && apk upgrade
RUN apk add bash
RUN apk add libc6-compat
# RUN apk cache clean

# set a non privileged user to use when running this image
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
SHELL ["bash", "-c"] 

# set right (secure) folder permissions
RUN mkdir -p /home/nodejs/app/node_modules && chown -R nodejs:nodejs /home/nodejs/app

# PNPM FOR ALPINE LINUX IS KINDA COMPLICATED...
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm
RUN mkdir -p /home/nodejs/.pnpm-store && chown -R nodejs:nodejs /home/nodejs/.pnpm-store
RUN mkdir -p /home/nodejs/.pnpm-global && chown -R nodejs:nodejs /home/nodejs/.pnpm-global
RUN pnpm config set store-dir /home/nodejs/.pnpm-store


USER nodejs
WORKDIR /home/nodejs/app
SHELL ["bash", "-c"] 


# set default node env
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=production
ENV PNPM_HOME=/home/nodejs/.local/share/pnpm    
ENV PATH=$PATH:$PNPM_HOME                

COPY --chown=nodejs:nodejs pnpm-workspace.yaml* ./

# Install dependencies
COPY --chown=nodejs:nodejs package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* .pnpmfile.cjs* ./
RUN pnpm install --prod


# This dockerfile expects the project to already be built locally to make the Dockerfile do less and make it smaller 
COPY --chown=nodejs:nodejs dist ./
# Repetitive, ik. For compatability reasons
COPY --chown=nodejs:nodejs dist ./dist

# COPY --chown=nodejs:nodejs healthCheck.js .
COPY --chown=nodejs:nodejs .env* ./
# Technically, this file is already on the system, but this is just for consistency's sake
COPY --chown=nodejs:nodejs pm2.config.js* ./

# Work in progress
RUN SHELL=bash pnpm setup
# RUN pnpm add -g pm2
RUN pnpm add -g rimraf cross-env

EXPOSE 8000

ENV PORT 8000

CMD [ "npm", "start" ]
# CMD [ "pm2-runtime", "start", "pm2.config.js" ]

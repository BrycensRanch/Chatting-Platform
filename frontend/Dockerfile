# Initialize alpine to get ready for Node awesomeness.
# Image where Node 18 (LTS) alpine + git + ssh is installed
FROM timbru31/node-alpine-git:hydrogen AS init 
# update packages, to reduce risk of vulnerabilities
RUN apk update && apk upgrade
RUN apk add bash
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
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

# COPY --chown=nodejs:nodejs . . 

ENV NODE_ENV=production
ENV PNPM_HOME=/home/nodejs/.local/share/pnpm    
ENV PATH=$PATH:$PNPM_HOME   

# Install dependencies based on the preferred package manager
COPY --chown=nodejs:nodejs package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm install --prod 

#RUN npm i -g next

# Work in progress
RUN SHELL=bash pnpm setup
# RUN pnpm add -g pm2
RUN pnpm add -g cross-env rimraf

# Rebuild the source code only when needed
# FROM timbru31/node-alpine-git:hydrogen AS builder
# WORKDIR /home/nodejs/app


# COPY --from=deps --chown=nodejs:nodejs . .
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# copy project definition/dependencies files, for better reuse of layers
# COPY --chown=nodejs:nodejs package.json ./

# RUN yarn build

# If using yarn, remove # above and comment below instead
# RUN npm run build

# IMPORTANT: NOT BUILDING, USING PREBUILT


# Production image, copy all the files and run next
# FROM timbru31/node-alpine-git:hydrogen AS runner
# WORKDIR /home/nodejs/app
# COPY --chown=nodejs:nodejs node_modules ./node_modules
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nodejs:nodejs .next ./.next
COPY --chown=nodejs:nodejs .env* ./
COPY --chown=nodejs:nodejs healthCheck.js ./healthCheck.js

# COPY --chown=nodejs:nodejs .next/static* ./.next/static

# COPY --chown=nodejs:nodejs --from=builder . .
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone* ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

COPY --chown=nodejs:nodejs pm2.config.js .
COPY --chown=nodejs:nodejs server.js .

# Using Containers? We got your back. Start today using pm2-runtime, a perfect companion to get the most out of Node.js in production environment.
# we're not using pm2 in containers waste of time and resources
CMD ["npm", "start"]
# CMD ["pnpm", "pm2"]
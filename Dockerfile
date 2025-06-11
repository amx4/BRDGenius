
# Dockerfile for BRDGenius Next.js Application

# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# 2. Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build time if any
# ARG NEXT_PUBLIC_API_KEY
# ENV NEXT_PUBLIC_API_KEY=${NEXT_PUBLIC_API_KEY}

RUN npm run build

# 3. Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Set NEXT_TELEMETRY_DISABLED to 1 to disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# If you have a custom server.js, copy it here.
# COPY --from=builder /app/server.js ./server.js

EXPOSE 3000
ENV PORT 3000

# USER nextjs # Uncomment if you create a non-root user

CMD ["node", "server.js"]

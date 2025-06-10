# Stage 1: Build the application
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json ./
# If package-lock.json is used and committed, prefer npm ci
# COPY package-lock.json ./
# RUN npm ci --legacy-peer-deps
RUN npm install --legacy-peer-deps

COPY . .

# Build the Next.js application
# Ensure your build script is correctly defined in package.json
RUN npm run build

# Stage 2: Production image
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production

# Next.js recommends creating a non-root user, but node:slim images already include a 'node' user.
# We will use the existing 'node' user.
# USER node
# Group 'node' also exists.

# Copy necessary files from the builder stage
# Public assets
COPY --from=builder /app/public ./public

# Standalone output (ensure next.config.js has output: 'standalone')
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Set the user to the non-root user 'node'
USER node

# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# The standalone output includes a server.js file.
CMD ["node", "server.js"]

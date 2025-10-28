# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools needed for sharp (during build only)
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build-time args
ARG SECRET_KEY_USER_PAYLOAD
ARG SECRET_KEY_ACCESS_TOKEN
ARG SECRET_KEY_REFRESH_TOKEN
ARG JWT_ACCESS_TOKEN_KEY
ARG JWT_REFRESH_TOKEN_KEY
ARG NEXT_PUBLIC_CENEXT_URL
ARG JWT_SECRET_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_LOCALE
ARG NEXT_PUBLIC_BUYER_TYPE

# Env available at build time
ENV NODE_ENV=production

# Build production bundle (sharp is compiled here)
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install OS deps for sharp runtime
RUN apk add --no-cache libc6-compat

# Copy package.json + node_modules from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy build artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Runtime env vars (redeclare ARGs so they can be passed at build time)
ARG SECRET_KEY_USER_PAYLOAD
ARG SECRET_KEY_ACCESS_TOKEN
ARG SECRET_KEY_REFRESH_TOKEN
ARG JWT_ACCESS_TOKEN_KEY
ARG JWT_REFRESH_TOKEN_KEY
ARG NEXT_PUBLIC_CENEXT_URL
ARG JWT_SECRET_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_LOCALE
ARG NEXT_PUBLIC_BUYER_TYPE

ENV NODE_ENV=production \
    PORT=80 \
    HOST=0.0.0.0 \
    SECRET_KEY_USER_PAYLOAD=$SECRET_KEY_USER_PAYLOAD \
    SECRET_KEY_ACCESS_TOKEN=$SECRET_KEY_ACCESS_TOKEN \
    SECRET_KEY_REFRESH_TOKEN=$SECRET_KEY_REFRESH_TOKEN \
    JWT_ACCESS_TOKEN_KEY=$JWT_ACCESS_TOKEN_KEY \
    JWT_REFRESH_TOKEN_KEY=$JWT_REFRESH_TOKEN_KEY \
    NEXT_PUBLIC_CENEXT_URL=$NEXT_PUBLIC_CENEXT_URL \
    JWT_SECRET_KEY=$JWT_SECRET_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_LOCALE=$NEXT_LOCALE \
    NEXT_PUBLIC_BUYER_TYPE=$NEXT_PUBLIC_BUYER_TYPE

EXPOSE 80

CMD ["npm", "start"]

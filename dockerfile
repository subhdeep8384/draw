# ---------- Base ----------
    FROM node:20-alpine AS base
    WORKDIR /app
    RUN apk add --no-cache libc6-compat
    RUN npm install -g pnpm turbo

    FROM base AS deps
    COPY package.json pnpm-lock.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    
    RUN pnpm install --frozen-lockfile
    
    FROM base AS builder
    COPY --from=deps /app ./
    
    RUN pnpm turbo build
    
    FROM node:20-alpine AS runner
    WORKDIR /app
    RUN npm install -g pnpm
    
    COPY --from=builder /app ./

    CMD ["pnpm", "start"]
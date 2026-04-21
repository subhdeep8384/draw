FROM oven/bun:latest

WORKDIR /draw


COPY package.json bun.lock turbo.json ./


COPY packages ./packages
COPY apps/web ./apps/web


RUN bun install


WORKDIR /draw/packages/db
RUN bunx prisma generate


WORKDIR /draw/apps/web

EXPOSE 3000

CMD ["bun", "run", "dev", "--hostname", "0.0.0.0"]
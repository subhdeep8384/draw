FROM oven/bun:latest 

WORKDIR /draw
COPY package.json bun.lock turbo.json ./

COPY packages ./packages
COPY apps/ws ./apps/ws

RUN bun install 
WORKDIR /draw/packages/db 
RUN bunx prisma generate 
RUN bun install


WORKDIR /draw
RUN bun install 

WORKDIR /draw/apps/ws
RUN bun install

EXPOSE 5000 
CMD ["bun" , "run" , "index.ts"]



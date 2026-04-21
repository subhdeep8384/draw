FROM oven/bun:latest 

WORKDIR /draw

COPY package.json bun.lock turbo.json ./

COPY packages ./packages
COPY apps/server ./apps/server

RUN bun install 


WORKDIR /draw/packages/db 
RUN bunx prisma generate 
RUN bun install


WORKDIR /draw
RUN bun install 

WORKDIR /draw/apps/server
RUN bun install

EXPOSE 3005 
CMD ["bun" , "run" , "index.ts"]



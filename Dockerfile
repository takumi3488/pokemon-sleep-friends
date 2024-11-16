FROM oven/bun:1 AS base
WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install && bun run playwright:install
COPY src/index.ts src/kvs.ts ./

ENTRYPOINT [ "bun", "run", "index.ts" ]

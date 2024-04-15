FROM node:18.17-bullseye as base
LABEL layer="base"

WORKDIR /service
COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .
COPY .pnpm-store .pnpm-store
COPY src src

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install

WORKDIR /service
CMD pnpm start

FROM node:24.13.1-alpine

RUN apk add --no-cache git

RUN corepack enable
RUN corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY config ./config

RUN pnpm config set --global allowBuilds true

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter ts-utils build

EXPOSE 3000

CMD ["pnpm", "start"]
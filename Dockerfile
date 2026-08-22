FROM node:24.13.1-alpine

RUN apk add --no-cache git

RUN corepack enable && \
    corepack prepare pnpm@10.30.0 --activate

RUN npm install -g typescript@5.9.3

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY ./config ./config

RUN pnpm config set --global allowBuilds true

RUN pnpm install --frozen-lockfile

COPY . .

RUN cp .env.example .env

RUN pnpm --filter ts-utils build

EXPOSE 3000
CMD ["pnpm", "start"]
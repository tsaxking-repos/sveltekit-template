FROM node:24.13.1-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache git
RUN npm install -g typescript@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY ./config ./config

RUN pnpm config set --global allowBuilds true

# Assume all necessary dependencies are installed
COPY . .
# This is for type checking, we are not baking .env into the system
COPY ./.env.example .env 

RUN pnpm --filter ts-utils build

EXPOSE 3000
CMD ["pnpm", "start"]
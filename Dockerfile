FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json ./

RUN yarn config set registry https://registry.npmjs.org \
    && yarn install --network-timeout 600000

COPY . .
RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]

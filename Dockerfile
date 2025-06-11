FROM oven/bun:1-alpine AS builder

RUN apk add --no-cache python3 make g++ pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev openssl


WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY prisma ./prisma

RUN bun install

COPY . .

RUN bunx prisma generate

RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./


EXPOSE 3000

CMD ["bun", "run", "start"]


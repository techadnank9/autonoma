FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libvips42 \
    libheif1 \
    libjpeg62-turbo \
    libpng16-16 \
    libwebp7 \
    libgif7 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g tsx pnpm turbo

WORKDIR /app

COPY . .

ENV CI=true

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@autonoma/engine-web...

ENV NODE_ENV=production
ENV REMOTE_CHROME_ENDPOINT=127.0.0.1:3000

WORKDIR /app/apps/engine-web

EXPOSE 3001 9229

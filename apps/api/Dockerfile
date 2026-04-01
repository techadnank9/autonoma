FROM node:24-alpine
WORKDIR /app
COPY . .

ENV NODE_ENV=production
USER node
EXPOSE 4000
CMD ["node", "--enable-source-maps", ".output/server/index.mjs"]

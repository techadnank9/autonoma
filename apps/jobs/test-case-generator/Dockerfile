FROM node:24-alpine
RUN apk add --no-cache bash tree git
WORKDIR /app
COPY . .

ENV NODE_ENV=production
USER node
CMD ["node", "dist/index.js"]

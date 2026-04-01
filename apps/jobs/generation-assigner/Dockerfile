FROM platformatic/node-caged:25-alpine
WORKDIR /app
COPY . .

ENV NODE_ENV=production
RUN adduser -D -u 1000 node
USER node
CMD ["node", "dist/index.js"]

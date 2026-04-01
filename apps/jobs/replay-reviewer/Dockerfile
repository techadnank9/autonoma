FROM node:24-slim
WORKDIR /app
COPY . .
RUN npm install sharp

ENV NODE_ENV=production
USER node
CMD ["node", "dist/index.js"]

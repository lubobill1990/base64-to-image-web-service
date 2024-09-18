FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

FROM base AS builder

RUN npm install

COPY . .

RUN npm run build

FROM base AS final

COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV PORT 3000

ENV PROD 1

CMD ["node", "dist/app.js"]

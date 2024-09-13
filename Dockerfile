FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

FROM node:alpine

WORKDIR /app

COPY --from=builder /app/dist /app
COPY --from=builder /app/prisma ./prisma

COPY package*.json ./

RUN npm install --only=production

# CMD [ "node", "index.js" ]
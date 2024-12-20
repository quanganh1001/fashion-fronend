FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM node:20-alpine AS runner
WORKDIR /app
COPY . .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["yarn","start"]


# docker build -t fashion-frontend:1.0.0 .
# docker run --name fashion-frontend -d -p 80:3000 --rm fashion-frontend:1.0.0

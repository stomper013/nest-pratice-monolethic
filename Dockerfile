# Build
FROM node:18-alpine AS build

WORKDIR /build

COPY package.json yarn.lock ./

RUN yarn install --production=false --ignore-scripts --frozen-lockfile \
  && yarn cache clean

COPY . .

RUN yarn build



# Export image
FROM node:18-alpine AS main

WORKDIR /app

COPY --from=build /build/tsconfig.json/ /app

COPY --from=build /build/package.json /app

COPY --from=build /build/node_modules/ /app/node_modules/

COPY --from=build /build/src/core/database /app/migrate/

COPY --from=build /build/dist/ /app/dist/

EXPOSE 3000

CMD npx mikro-orm migration:up --config ./migrate/orm.config.ts && node ./dist/main.js
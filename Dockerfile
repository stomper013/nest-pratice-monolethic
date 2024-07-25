# Build
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production=false --ignore-scripts --frozen-lockfile \
  && yarn cache clean

COPY . .

RUN yarn build

# Export image

FROM node:18-alpine as main

WORKDIR /

COPY --from=build /app/dist/apps/address-service/ /

COPY --from=build /app/node_modules/ /node_modules/

COPY --from=build /app/package.json /

COPY --from=build /app/grpc /grpc

COPY --from=build /app/libs/core/databases/ /migrate/

COPY --from=build /app/tsconfig.json/ /

EXPOSE 3007

CMD yarn run migration:run -- -d ./migrate/postgres/address/ormconfig.ts && node main.js
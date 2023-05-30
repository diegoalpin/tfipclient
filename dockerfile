FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -g @angular/cli

RUN npm install
COPY . .
RUN npm run build

EXPOSE 4200

CMD ["npm","start"]
ENTRYPOINT [ "ng", "serve", "--host", "0.0.0.0", "--port", "4200" ]
# ENTRYPOINT [ "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check" ]


# FROM node:20 AS builder
# WORKDIR /app
# COPY . .
# RUN npm i -g @angular/cli
# RUN npm i
# RUN ng build
# FROM nginx
# COPY --from=builder /app/dist/tfip-care-care-client /var/html/www
# EXPOSE 80
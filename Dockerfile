### STAGE 1: Build ###
FROM node:19.5.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.d/default.conf

COPY --from=build /app/dist/admin/browser /usr/share/nginx/html

EXPOSE 80

# Docker commands
# docker build -t Frontend .
# docker run -d -p 4200:80 Frontend
FROM node:22-alpine AS builder

ARG API_URL=/api

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN sed -i "s|/api|${API_URL}|g" dist/frontend/browser/main*.js || true

FROM nginx:alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]

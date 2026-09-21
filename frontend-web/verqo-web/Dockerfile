# syntax=docker/dockerfile:1

# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production

# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime

# Non-root Nginx (nginx-unprivileged image would also work; this keeps a
# single well-known base image and just fixes permissions + port instead).
RUN sed -i 's/listen\s*80;/listen 8080;/' /etc/nginx/conf.d/default.conf \
  && chown -R nginx:nginx /var/cache/nginx /var/run || true
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/verqo-web/browser /usr/share/nginx/html

EXPOSE 8080
USER nginx

CMD ["nginx", "-g", "daemon off;"]

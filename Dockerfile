# Этап сборки: используем официальный образ Node.js
FROM node:16-alpine AS builder
WORKDIR /app

# Копируем файлы зависимостей для использования кеша Docker-слоёв
COPY package*.json ./
RUN npm install

# Копируем исходный код и выполняем сборку Vite
COPY . .
RUN npm run build

# Этап запуска: копируем файлы сборки в образ Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем стандартный порт для Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
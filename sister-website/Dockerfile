# 階段 1: 編譯 React 專案
FROM node:24-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 階段 2: 使用 Nginx 部署
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 💡 如果妳是用 Vite，產出夾是 dist；如果是 CRA，請改為 build
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
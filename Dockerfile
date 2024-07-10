FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN chmod +x wait-for-db-migrate.sh
EXPOSE 8080
CMD ["node", "dist/index.js"]

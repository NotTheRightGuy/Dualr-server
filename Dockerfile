FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN chmod +x wait-for-it.sh
RUN chmod +x run-migration.sh
EXPOSE 8080
CMD ["node", "dist/index.js"]

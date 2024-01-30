FROM --platform=linux/amd64 node:20.11-alpine3.18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "./src/server.js"]

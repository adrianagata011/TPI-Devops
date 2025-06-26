## File: backend/Dockerfile
# This Dockerfile sets up a Node.js environment for the backend application, installs dependencies, and
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]

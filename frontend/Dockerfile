# Dockerfile for a Node.js application
# This Dockerfile sets up a Node.js environment, installs dependencies, and runs the application.
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

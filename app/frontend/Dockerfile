FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /frontend
COPY package*.json ./
RUN npm ci

COPY . .

# ENTRYPOINT ["npm", "start"]

# the start.sh entrypoint runs the app in production mode
ENTRYPOINT ["sh", "start.sh"]
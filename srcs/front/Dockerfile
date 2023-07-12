FROM node:lts-alpine

COPY package*.json ./
RUN npm install
COPY . ./front

CMD ["npm", "start"]
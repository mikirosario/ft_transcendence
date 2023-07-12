FROM node:lts-alpine

COPY package*.json ./
RUN npm install
COPY . ./back

CMD ["npm", "run", "start"]
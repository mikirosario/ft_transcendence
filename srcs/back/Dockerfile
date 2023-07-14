FROM node:lts-alpine

RUN mkdir back
WORKDIR /back
# COPY package*.json .
# COPY tsconfig*.json .
COPY . .
RUN npm install

CMD npx prisma migrate dev && npm run start
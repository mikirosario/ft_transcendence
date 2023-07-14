FROM node:lts-alpine

RUN mkdir back
WORKDIR /back
COPY . .
RUN npm install

CMD npx prisma migrate dev && npm run start
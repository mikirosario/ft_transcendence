FROM node:lts-alpine

RUN mkdir front
WORKDIR /front
COPY . .
RUN npm install

CMD tail -f
# CMD npm start
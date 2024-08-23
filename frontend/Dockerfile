FROM node:20

RUN mkdir front

WORKDIR front

COPY . /front

RUN npm i

ENTRYPOINT ["npm", "start"]
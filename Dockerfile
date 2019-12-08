FROM node:12

WORKDIR /usr/src/app

COPY package.json /usr/src/app

COPY package-lock.json /usr/src/app

RUN npm install

COPY . /usr/src/app

RUN npm install -g standard

RUN npm install -g node-mongo-seeds

RUN seed

RUN mkdir logs && touch logs/erros.log logs/warnings.log

EXPOSE 3000

CMD ["node", "app.js"]
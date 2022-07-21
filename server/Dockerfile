FROM  alskfl222/sv-server:0.4

RUN git pull

WORKDIR /streamview/server

RUN yarn
RUN yarn build

CMD ["yarn", "start:prod"]
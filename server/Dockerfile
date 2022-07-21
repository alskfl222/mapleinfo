FROM  alskfl222/sv-server:0.2

RUN apk add git
RUN git clone https://github.com/alskfl222/streamview.git

WORKDIR /streamview/server

RUN yarn
RUN yarn build

CMD ["yarn", "start:prod"]
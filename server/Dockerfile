FROM  alskfl222/sv-server:0.2

RUN apk add git
RUN git clone git@github.com:alskfl222/streamview.git

WORKDIR /streamview/server

RUN yarn

CMD ["yarn", "start:prod"]
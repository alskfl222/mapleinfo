FROM  node:16.14.2-alpine

RUN apk update
RUN apk add git
RUN git clone https://github.com/alskfl222/streamview.git

WORKDIR /streamview/client

RUN yarn

CMD ["yarn", "start"]
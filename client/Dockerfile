FROM  alskfl222/sv-client:0.1

RUN apk add git
RUN git clone https://github.com/alskfl222/streamview.git

WORKDIR /streamview/client

RUN yarn

CMD ["yarn", "start"]
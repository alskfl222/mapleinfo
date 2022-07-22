FROM  node:16.14.2-alpine

RUN apk update

RUN apk add --no-cache python3 py3-pip
RUN apk add git curl gcc musl-dev python3-dev libffi-dev openssl-dev

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

RUN git clone https://github.com/alskfl222/streamview.git

WORKDIR /streamview/observer
RUN pip3 install -r requirements.txt

WORKDIR /streamview/server
RUN yarn && yarn build

CMD ["yarn", "start:prod"]
FROM  node:16.14.2-alpine

RUN apk update

RUN apk add --no-cache python3 py3-pip
RUN apk add git curl gcc musl-dev python3-dev libffi-dev openssl-dev

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

RUN pip3 install python-socketio python-socketio['client'] pymongo \
    dnspython python-dotenv bs4 

RUN git clone https://github.com/alskfl222/streamview.git
WORKDIR /streamview/server

RUN yarn
RUN yarn build

CMD ["yarn", "start:prod"]
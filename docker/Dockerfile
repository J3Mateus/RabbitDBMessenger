ARG NODE_VERSION=latest

FROM node:$NODE_VERSION as compiler

ARG APP_HOME=/code
ARG APP_DOCKER=/docker

WORKDIR $APP_HOME
COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:$NODE_VERSION

COPY --from=compiler /code/dist  /code/src
COPY --from=compiler /code/package.json  /code/
COPY --from=compiler /code/yarn.lock  /code/
COPY --from=compiler /code/resource   /code/src/app/api/resource
RUN yarn install

ARG APP_HOME=/code
ARG APP_DOCKER=/docker

# set work directory
WORKDIR $APP_HOME

# install dependencies
RUN set -ex \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
        libpq-dev \
        openrc \
        file \
        libmagic1 \
        libglib2.0-0 \
        libpango-1.0-0 \
        libstdc++6 \
    && mkdir -p /var/log/supervisor \
    && mkdir -p /var/run/gunicorn \
    && rm -rf /tmp/* \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y curl    
# Define versão do arduino-cli
ARG ARDUINO_CLI_VERSION=0.19.2

# copy configs
COPY $APP_DOCKER/configs/nginx.conf /etc/nginx/http.d/default.conf

# copy scripts
COPY $APP_DOCKER/scripts/start /start-api

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /opt/bin/
RUN chmod +x /opt/bin/wait-for-it.sh

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/bin sh
RUN arduino-cli core update-index
RUN arduino-cli config init
RUN arduino-cli config set library.enable_unsafe_install true
RUN arduino-cli config add board_manager.additional_urls https://arduino.esp8266.com/stable/package_esp8266com_index.json
RUN arduino-cli core install esp8266:esp8266

# set permission
RUN chmod +x /start-api

# run script
CMD ["/opt/bin/wait-for-it.sh", "database:5432"]
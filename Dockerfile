FROM debian:jessie

WORKDIR /openlmis-fulfillment-ui

COPY package.json .
COPY bower.json .
COPY config.json .
COPY src/ ./src/
COPY build/messages/ ./messages/

FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y nodejs && \
    apt-get install -y npm && \
    apt-get install -y git

RUN apt-get install -y libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

ADD src/ /opt/MBC-Ping-Pong
ADD startdocker.sh /opt/startdocker.sh

RUN npm install --global browserify

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN chmod +x /opt/startdocker.sh

EXPOSE 11002

CMD [ "/opt/startdocker.sh"]

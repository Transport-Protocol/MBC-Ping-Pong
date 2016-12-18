FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y nodejs && \
    apt-get install -y npm && \
    apt-get install -y git

ADD src/ /opt/MBC-Ping-Pong
ADD startdocker.sh /opt/startdocker.sh

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN chmod +x /opt/startdocker.sh
RUN npm install --global browserify

EXPOSE 11002

CMD [ "/opt/startdocker.sh"]

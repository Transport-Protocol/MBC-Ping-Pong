FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y nodejs && \
    apt-get install -y npm

ADD src/ /opt/MBC-Ping-Pong
ADD startdocker.sh /opt/startdocker.sh

RUN chmod +x /opt/startdocker.sh

EXPOSE 8080

CMD [ "/opt/startdocker.sh"]

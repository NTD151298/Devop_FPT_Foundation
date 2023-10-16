# syntax=docker/dockerfile:1
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y supervisor

RUN mkdir -p /var/log/supervisor

WORKDIR /scripts

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY counting.sh counting.sh
COPY helping.sh helping.sh 

CMD ["/usr/bin/supervisord"]
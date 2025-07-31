FROM ubuntu:24.04

RUN apt update && apt install -y nginx openssh-server

RUN id -u ubuntu 2>/dev/null || useradd -ms /bin/bash ubuntu && echo 'ubuntu:pass123' | chpasswd
RUN mkdir /var/run/sshd

COPY web /var/www/html

RUN chmod -R 755 /var/www/html

CMD service ssh start && nginx -g 'daemon off;'


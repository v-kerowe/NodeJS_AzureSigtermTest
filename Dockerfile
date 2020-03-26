FROM node:8.9
RUN mkdir /code
WORKDIR /code
ADD package.json /code/
RUN npm install
ADD . /code/

# ssh
ENV SSH_PASSWD "root:Docker!"
RUN apt-get update \
        && apt-get install -y --no-install-recommends apt-utils dialog openssh-server \
	&& echo "$SSH_PASSWD" | chpasswd 

COPY sshd_config /etc/ssh/
COPY init.sh /usr/local/bin/
RUN chmod u+x /usr/local/bin/init.sh

EXPOSE 3001 2222
ENTRYPOINT ["/usr/local/bin/init.sh"]
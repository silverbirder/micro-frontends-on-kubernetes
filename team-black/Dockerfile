FROM alpine:3

RUN apk add --update --no-cache nginx && mkdir -p /run/nginx && touch /run/nginx/nginx.pid

COPY ./common /usr/share/nginx/html/common

EXPOSE 3000

ENTRYPOINT /usr/sbin/nginx -g "daemon off;" -c /etc/nginx/nginx.conf
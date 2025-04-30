FROM node:20-alpine

ENV HTTP_PORT=5000
ENV HTTP_HOST=0.0.0.0

VOLUME [ "/app/data" ]
EXPOSE 5000

COPY . /app
WORKDIR /app
RUN mv -v .env.prod .env

RUN npm i && npm run build

ENTRYPOINT [ "sh", "/app/entrypoint.sh" ]

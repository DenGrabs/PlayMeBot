FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN addgroup -g 1001 -S playmeuser && \
    adduser -S playmeuser -u 1001 && \
    chown -R playmeuser:playmeuser /app

USER playmeuser

EXPOSE ${PORT}

CMD ["npm", "start"]


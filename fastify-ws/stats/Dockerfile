FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "stats.mjs"]
# CMD ["tail", "-f", "/dev/null"]
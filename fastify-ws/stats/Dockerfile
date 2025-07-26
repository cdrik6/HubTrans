FROM node:24

RUN apt-get update \
    && apt-get install -y sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY src/ src/

CMD ["node", "src/stats.mjs"]
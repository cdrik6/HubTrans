FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# CMD ["node", "server.mjs"]
CMD ["tail", "-f", "/dev/null"]
# ENTRYPOINT ["bash", "/tmp/init_db.sh"]
# # execute MariaDB initialization script
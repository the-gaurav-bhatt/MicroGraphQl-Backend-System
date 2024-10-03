FROM node:20
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000
# RUN npm run rover

CMD ["npm", "start"] 
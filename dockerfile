FROM node:16.14.0
COPY package*.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm", "start"]
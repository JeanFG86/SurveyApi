FROM node:16
WORKDIR /usr/src/survey-api
COPY  package.json ./
RUN npm install
COPY ./dist ./dist
EXPOSE 5000
CMD ["npm", "run", "dev"]

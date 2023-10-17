ARG node_version=18
FROM node:${node_version}-alpine

# Mount current directory using the `-v` flag:
# ./:/usr/app
WORKDIR /usr/app

# Install app dependencies 
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 5400

CMD ["npm", "run", "dev", "--", "--port", "5400"]
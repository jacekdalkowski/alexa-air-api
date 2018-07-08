FROM node:8.5.0

# Bundle app source
COPY src /src
# Install app dependencies
RUN cd /src; yarn install

EXPOSE 3001
CMD PORT=3001 node ./src/runners/master.run.js
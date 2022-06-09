FROM node:16

LABEL version="1.0"
LABEL description="Base docker image for SR Velocity"
LABEL maintainer = ["justintijunel@gmail.com"]

ENV GENERATE_SOURCEMAP = false

COPY ./client /client
COPY ./backend /backend

WORKDIR /client
RUN npm install --force
RUN npm run build --prod

WORKDIR /backend
RUN npm install

CMD ["node", "app.js"]
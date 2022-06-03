FROM node:latest

LABEL version="0.1"
LABEL description="Base docker image for SR Velocity"
LABEL maintainer = ["justintijunel@gmail.com"]

ENV NODE_OPTIONS=--max_old_space_size=4096
ENV GENERATE_SOURCEMAP = false

COPY ./client /client
COPY ./backend /backend

WORKDIR /client
RUN npm install --force
RUN npm run build

WORKDIR ../backend
RUN npm install --force

EXPOSE 5000

CMD ["node", "app.js"]
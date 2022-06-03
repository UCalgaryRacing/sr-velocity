FROM node:15.13.0

LABEL version="0.1"
LABEL description="Base docker image for SR Velocity"
LABEL maintainer = ["justintijunel@gmail.com"]

ENV GENERATE_SOURCEMAP = false

COPY ./client /client
COPY ./backend /backend

WORKDIR /client
RUN npm install --production
RUN npm run build

WORKDIR ../backend
RUN npm install --production

EXPOSE 5000

CMD ["node", "app.js"]
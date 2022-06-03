FROM node:latest

LABEL version="1.0"
LABEL description="Base docker image for SR Velocity"
LABEL maintainer = ["justintijunel@gmail.com"]

ENV NODE_OPTIONS=--max_old_space_size=8192
# ENV GENERATE_SOURCEMAP = false

COPY ./client /client
COPY ./backend /backend

# WORKDIR /client
# RUN npm install --force
# RUN npm run build

WORKDIR /backend
RUN npm install --force

EXPOSE 5001

CMD ["node", "app.js"]
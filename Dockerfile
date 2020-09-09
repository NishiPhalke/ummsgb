FROM node:latest

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install -g yarn

RUN mkdir -p /app/
COPY public /app/public
COPY src /app/src
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
WORKDIR /app/

RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN yarn
RUN yarn build

FROM nginx:1.13-alpine
COPY --from=0 /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
COPY scripts/run-nginx.sh ./
EXPOSE 80
CMD ./run-nginx.sh

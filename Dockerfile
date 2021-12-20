FROM node:alpine
WORKDIR /usr/src/app
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
# WORKDIR /usr/share/nginx/html/
# RUN npm install -g npm@7.23.0
COPY package.json package-lock.json ./
# COPY  dist vajraah/dist
COPY dist dist/
RUN ls
WORKDIR /usr/src/app/dist
RUN ls
WORKDIR /usr/src/app/dist/admin
RUN ls
WORKDIR /usr/src/app
EXPOSE 4000
ENV NODE_ENV production

CMD ["npm", "run", "serve:ssr"]

FROM nginx:latest



# COPY . .
RUN ls
COPY dist/invoice-generator/static  /usr/share/nginx/html
RUN ls
COPY nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /etc/nginx
RUN ls

WORKDIR /usr/share/nginx/html/
RUN ls
EXPOSE 80
FROM nginx:alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY dist/ /usr/share/nginx/html/

EXPOSE 3000
ENV NGINX_ENVSUBST_FILTER=API_UPSTREAM

FROM tiangolo/uvicorn-gunicorn-fastapi

#update
RUN apt-get update

#install requirements
COPY ./requirements.txt /app/requirements.txt 
WORKDIR /app
RUN pip3 install -r requirements.txt --no-cache-dir
# RUN apt-get install libmagic1
#copy ap
ARG MODE
ENV MODE=$MODE
WORKDIR /app
COPY . /app
RUN ls
EXPOSE 8000
# RUN chmod +x deploy.sh
# CMD ["gunicorn", "-w", "3", "-b", ":80", "-t", "360", "--reload", "api.wsgi:app"]
# ENTRYPOINT ["./deploy.sh"]
CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["gunicorn"  , "-b", "0.0.0.0:80", "app:app"]
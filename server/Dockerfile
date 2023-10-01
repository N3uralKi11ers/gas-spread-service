FROM python:3.10.6

WORKDIR /app

RUN apt-get update && apt-get install -y libgl1-mesa-glx

COPY requirements.txt requirements.txt
RUN pip3 install -U pip
RUN pip3 install -U -r requirements.txt --use-pep517
COPY . /app

EXPOSE 8000

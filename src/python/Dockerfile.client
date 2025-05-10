# Use official Python 3 base image
FROM python:3.10-slim

WORKDIR /usr/src/app

COPY client.py main.py ./
COPY IO ./IO   

ENTRYPOINT ["python", "main.py"]

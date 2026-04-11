FROM python:3.12-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /tmdb

COPY ./requirements.txt /tmdb/

RUN pip install -r requirements.txt

COPY . /tmdb/

EXPOSE 8000
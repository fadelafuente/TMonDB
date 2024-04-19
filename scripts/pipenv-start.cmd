@echo off

cd tmdb
start pipenv run py manage.py runserver

cd ..
cd frontend
start npm start

exit
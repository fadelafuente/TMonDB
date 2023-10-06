@echo off

cd tmdb-app
start pipenv run py manage.py runserver

cd ..
cd frontend
start npm start

exit
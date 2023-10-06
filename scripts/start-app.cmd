@echo off

cd ..
cd tmdb-app
start py manage.py runserver

cd ..
cd frontend
start npm start

exit
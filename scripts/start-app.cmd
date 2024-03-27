@echo off

cd tmdb
start py manage.py runserver

cd ..
cd frontend
start npm start

exit
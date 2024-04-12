@echo off

cd tmdb
start pipenv run py manage.py runserver 192.168.86.30:8000

cd ..
cd frontend
start npm start

exit
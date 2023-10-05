# Development Setup
###Python 3.12.0
Python has a new version as of October 2nd, 2023, and it has bug fixes, so we are currently using 3.12.0.  We also need Python to install django.
* [Download Python | Python.org](https://www.python.org/downloads/)
* **NOTE:** when downloading Python, pip can also be installed under optional features. Because pip is also required, if you did not choose to install pip, follow the [pip documentation](https://pip.pypa.io/en/stable/installation/).

Check if successfully installed:
```
py --version
pip --version
```

You can install pipenv if you want to use a virtual environment and not have a ton of packages everywhere
```
pip install pipenv
```

To install the python packages used by the app, run one of the two following commands:
```
pip install -r requirements.txt
pipenv run pip install -r requirements.txt
```
**NOTE:** We might consider moving this into a docker container.

If you use pipenv, make sure to activate the environment using:
```
pipenv shell
```

### Node.js
We need node.js to install React. As of 10/04/2023, the version we are using is v18.18.0.
* [Download | Node.js](https://nodejs.org/en/download)

### Django
The version we are using is 4.2.5.
```
pip install Django==4.2.5
```


Check if successfully installed:
```
django-admin --version
```

### OPTIONAL VS Code Extensions
The following extensions may be useful:
![](images/extensions.jpg)
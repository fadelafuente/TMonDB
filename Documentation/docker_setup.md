# Docker Setup
### Docker
[Download Docker Desktop](https://www.docker.com/) from their website. 

### Postgres Image
To dockerize the PostgreSQL DB, you will first need to pull the postgres image. run the following command:
```
docker pull postgres:<version>

// As of 7/31/2024, we are using version 16.0
docker pull postgres:16.0
```

### Node
the node_modules are added as a volume to the frontend container, so you will need to install Node. As of 10/04/2023, the version we are using is v18.18.0.
* [Download | Node.js](https://nodejs.org/en/download)

then run in the frontend directory:
```
npm install
```

### Build Images
Before starting up the container, you have to build the images for the containers. Run the following command in the project directory:
```
docker compose build
```

### Start Containers
After you build the images, then you can build and start the containers. Run one of the following commands in the project directory:
```
docker compose up

// To run the containers in the background:
docker compose up -d
```

Alternatively, you can also build the images when the containers are run with the following command:
```
docker compose up --build
```

### Stop Containers
To stop the containers, run the followng command in the project directory:
```
docker compose down
```

## Profiles
We have Docker profiles that basically tell Docker which containers to spin up. By default, the current containers that are built and spun up are the frontend, backend, and the postgres containers. To change which profile to use, you can change the previous commands:
```
docker compose --profile <profile-name> build
docker compose --profile <profile-name> up
docker compose --profile <profile-name> down
```

The following profiles are available:
```
frontend
backend
backendlocal
dev (default, spins up frontend, backend, and postgres containers)
devlocal (spins up frontend and backendlocal containers)
```

These profiles are related to a .env file within the /env directory. You will have to create the following .env files:
```
/env/.env
/env/.env.development
/env/.env.development.local
```
TODO: Create .env.template files to show which environment variables you need

### Running Tests in a Docker Container
To run the backend tests, there are two methods you can do. First, you want to run the following command and copy either the id or name for the backend container.
```
docker container ls
```

The second step has two methods. The first method is to enter the backend container and run the test command.
```
docker exec -it <id-or-name> bash
// while in the container
python manage.py test
// type 'exit' and press enter to leave the container
```

The second methond is to run the tests using the docker exec command.
```
docker exec -it <id-or-name> python manage.py test
```








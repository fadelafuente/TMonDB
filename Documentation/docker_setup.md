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
dev (default)
devlocal
```









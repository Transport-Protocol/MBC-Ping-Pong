# MBC-Ping-Pong
Project Ping Pong

## Prerequires
- Docker https://www.docker.com/products/overview
- Docker-Compose: https://docs.docker.com/compose/install/
- Linux: The own user should be a member of the docker group

## Build:
- go to the root of the project folder (the folder which contains the docker-compose.yml)
- run `docker-compose build`

## Run:
- go to the root of the project folder (the folder which contains the docker-compose.yml)
- run `docker-compose up`
- exit with `CTRL + C`

## Develop:
- go to the root of the project folder (the folder which contains the docker-compose.yml)
- run `docker-compose -f docker-compose.yml -f docker-compose-dev.yml up`
- exit with `CTRL + C`

## ---- POSTGRES
sudo docker run \
  --name postgres \
  -e POSTGRES_USER=vitoramorim \
  -e POSTGRES_PASSWORD=minhasenhasecreta \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d \
  postgres

sudo docker ps
sudo docker exec -it postgres /bin/bash
ls
exit

## ---- adminer

sudo docker run \
  --name adminer \
  -p 8080:8080 \
  --link postgres:postgres \
  -d \
  adminer

## ---- MONGODB
sudo docker run \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=minhasenhasecreta \
  -d \
  mongo:4

## ---- MONGODB client
sudo docker run \
  --name mongoclient \
  -p 3000:3000 \
  --link mongodb:mongodb \
  -d \
  mongoclient/mongoclient

## ---- MONGODB criando user
sudo docker exec -it mongodb \
    mongo --host localhost -u admin -p minhasenhasecreta --authenticationDatabase admin \
    --eval "db.getSiblingDB('herois').createUser({user: 'vitoramorim', pwd: 'minhasenhasecreta', roles: [{role: 'readWrite', db: 'herois'}]})"

## ---- rodar npm test para dump default
npm test
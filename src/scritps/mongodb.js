// para ver o id do container mongodb
sudo docker ps

// passar o id do mongodb
sudo docker exec -it cd9002e1fa5b mongo 

// mostrar os databases
show databases ou show dbs

// mudando o contexto para uma database especifica
use herois

//autenticando com usuario e senha
db.auth('admin', 'minhasenhasecreta')

// mostrar as colecoes
show collections

//inserindo heroi na collection herois
db.herois.insert({
    nome: 'flash',
    poder: 'velocidade',
    dataNascimento: '1998-01-01'
})

//permite rodar muitos códigos javascript 
for(let i = 0; i < 1000; i++) {
    db.herois.insert({
        nome: `flash${i}`,
        poder: `velocidade aumentada${i}`,
        dataNascimento: `${i}-01-01`
    })
}

//conta o numero de registros na collection
db.herois.count()

//verificar os registros da collection
db.herois.find()

//verificar os registros da collection e formatar em json
db.herois.find().pretty()

// selecionar o primeiro registro
db.herois.findOne()

// selecionar os primeiros 100 registros e ordenado pelo nome
db.herois.find().limit(100).sort({nome: -1})

//selecionar somente o nome dos primeiros 5 registros 
db.herois.find({}, {poder: 1, _id: 0}).limit(5)

//selecionar os registros aonde nome = 'flash'
db.herois.find({nome: 'flash'})

//update
db.herois.update({nome: 'flash'}, {$set: {poder: "força"}})

db.herois.update({_id: ObjectId("6109b6a7caa641a1301d593e")}, {$set: {poder: "velocidade"}})

//delete
db.herois.remove({_id: ObjectId("6109b7f4caa641a1301d5950")})
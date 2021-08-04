// npm install mongoose
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://vitoramorim:minhasenhasecreta@localhost:27017/herois',
    { useNewUrlParser: true}, function (error) {
        if(!error) return;
        console.log('falha na conexão', error)
    })


const connection = Mongoose.connection
connection.once('open', () => console.log('database rodando'))


// setTimeout(() => {
//     const state = connection.readyState
//     console.log('state', state)
// }, 1000)

/* state
    0: "Desconectado",
    1: "Conectado",
    2: "Conectando",
    3: "Desconectando"
*/

// criar o modelo
const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//registrar o modelo
const model = Mongoose.model('heroi', heroiSchema)

async function main(){
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })
    console.log('resultCadastrar: ', resultCadastrar)

    const listItens = await model.find()
    console.log('listItens: ', listItens)
}

// rodar node mongodbExample.js
main()

//criar os nossos objetos no nosso estrategies mongo
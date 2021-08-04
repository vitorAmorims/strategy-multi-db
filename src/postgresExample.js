// npm install sequelize pg-hstore pg
//chamar o module Sequelize
const Sequelize = require('sequelize');
// criar o objeto driver
const driver = new Sequelize(
    'heroes',
    'vitoramorim',
    'minhasenhasecreta',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorAliases: false
    }
)

async function main(){
    const Herois = driver.define('herois', {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        }
        
    }, {
        tableName: 'TB_HEROIS',
        freezeTableName: false,
        timestamps: false,
    })
    await Herois.sync()
    // const result = await Herois.findAll({ raw: true })
    // console.log(result)
    //  Executing (default): SELECT id, nome, poder FROM TB_HEROIS AS herois;
    // [ { id: 1, nome: 'Batman', poder: 'dinheiro' },
    //   { id: 2, nome: 'flash', poder: 'velocidade' },
    //   { id: 3, nome: 'Deus', poder: 'mais que Divino' } ]

    // criando novo heroi
    // await Herois.create({ nome: 'Lucas', poder: 'carinhoso'})
    // chamando todos os herois
    // const result = await Herois.findAll({ raw: true })
    // console.log(result)

    // chamando apenas os nomes dos Herois
    // const result = await Herois.findAll({ raw: true, attributes: ['nome'] })
    // console.log(result)


}

main()
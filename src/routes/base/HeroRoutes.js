const Joi = require('joi');
const BaseRoute = require('./BaseRoute')

const failAction = (request, h, erro) => {
    throw erro
}

class HeroRoutes extends BaseRoute{
    constructor(db){
        super()
        this.db = db
    }
    list(){
        return {
            method: 'GET',
            path: '/herois',
            config: {
                validate: {
                    failAction: failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: (request, h, err) => {
                try{
                    const { nome, skip, limit} = request.query
                    // console.log('skip', typeof(skip))
                    // console.log('limit', limit)
                    // console.log('nome',nome)

                    let query = {}
                    // if (nome) query.nome = nome
                    // if (isNaN(skip))
                    //     throw Error('skip must be positive number')
                    // if (isNaN(limit))
                    //     throw Error('limit must be positive number')
                    query = { 
                        nome: {$regex: `.*${nome}*.`}
                    }

                    return this.db.read(nome ? query : {}, skip, limit)
                }catch(error){
                    console.log('Algum erro', error);
                    return 'Erro interno no servidor'
                }
                
            }
        }
    }
    create(){
        return {
            method: 'POST',
            path: '/herois',
            config: {
                validate: {
                    failAction: failAction,
                    query: {
                        nome: Joi.string().min(2).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: async (request, h, err) => {
                try{
                    const {nome, poder} = request.payload;
                    const data = await this.db.create({nome, poder})
                    return {
                        data,
                        message: 'Cadastro realizado com sucesso'
                    }
                }catch(err){
                    console.log('Algum erro', err)
                    return 'Aconteceu erro interno ao cadastrar'
                }
            }

        }

    }
}

module.exports = HeroRoutes
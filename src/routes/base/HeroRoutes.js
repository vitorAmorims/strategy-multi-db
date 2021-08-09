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
}

module.exports = HeroRoutes
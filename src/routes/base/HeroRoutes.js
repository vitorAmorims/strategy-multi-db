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
    update(){
        return {
            method: 'PATCH',
            path: '/herois/{id}',
            config: {
                validate: {
                    failAction: failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(2).max(100),
                        poder: Joi.string().min(2).max(100),
                    }
                }
            },
            handler: async (request, _h, _err) => {
                try{
                    const { payload } = request
                    const { id } = request.params
                    // console.log('payload', payload)
                    // console.log('id', id)
                    const dataString = JSON.stringify(payload)
                    const data = JSON.parse(dataString)

                    const result = await this.db.update(id, data)
                
                    if (result.nModified !== 1) {
                        return {
                            message: 'Não foi possível atualizar!'
                        }
                    }
                    
                    return {
                        message: 'Atualização realizada com sucesso'
                    }

                }catch(err){
                    console.log('algum erro', err)
                    return 'Aconteceu erro interno ao atualizar'
                }
            }
        }
    }

}

module.exports = HeroRoutes
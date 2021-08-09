const Joi = require('joi');
const Boom = require('boom');
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
                tags: ['api'],
                description: 'Deve listar os herois',
                notes: 'Pode paginar registados e filtrar por nome',
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
                    return Boom.internal()
                }
                
            }
        }
    }
    create(){
        return {
            method: 'POST',
            path: '/herois',
            config: {
                tags: ['api'],
                description: 'Cadastrar heroi',
                notes: 'Deve cadastrar heroi com nome e poder',
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
                    // console.log(request.url.query)
                    const {nome, poder} = request.payload || request.url.query
                    const data = await this.db.create({nome, poder})
                    return {
                        data,
                        message: 'Cadastro realizado com sucesso'
                    }
                }catch(err){
                    console.log('Algum erro', err)
                    return Boom.internal()
                }
            }

        }

    }
    update(){
        return {
            method: 'PATCH',
            path: '/herois/{id}',
            config: {
                tags: ['api'],
                description: 'Atualizar um heroi',
                notes: 'Permite atualizar nome, poder ou ambos',
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
                
                    if (result.nModified !== 1) return Boom.preconditionFailed('Id não encontrado no banco!')
                    
                    return {
                        message: 'Atualização realizada com sucesso'
                    }

                }catch(err){
                    console.log('algum erro', err)
                    return Boom.internal()
                }
            }
        }
    }
    delete(){
        return {
            method: 'DELETE',
            path: '/herois/{id}',
            config: {
                tags: ['api'],
                description: 'Deletar heroi',
                notes: 'Permite remover o heroi pelo Id',
                validate: {
                    failAction: failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request, _h, _err) => {
                try{
                    const { id } = request.params
                    const result = await this.db.delete(id)
                    

                    if (result.n !== 1)
                        return Boom.preconditionFailed('Id não encontrado no banco!')
                    
                    return {
                        message: 'Heroi removido com sucesso!'
                    }
                }catch(err){
                    console.log('algum erro', err)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroRoutes
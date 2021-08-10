const Joi = require('joi');
const Boom = require('boom');
const BaseRoute = require('./BaseRoute')
const JWT = require('jsonwebtoken');
const failAction = (request, h, erro) => {
    throw erro
}

const USER = {
    username: 'lucasamorim',
    password: 'minhasenhasecreta'
}

class AuthRoutes extends BaseRoute {
    constructor(secret){
        super()
        this.secret = secret
    }
    login(){
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'faz login com user e senha do banco',
                validate: {
                    failAction: failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, _h, _err) => {
                try{
                    const { username, password } = request.payload

                    if (username.toLowerCase() !== USER.username || password.toLowerCase() !== USER.password) {
                        return Boom.unauthorized()
                    }
                    const token = JWT.sign({username, id: 1}, this.secret)

                   return {
                        token
                    }

                }catch(err){
                    console.log('algum erro', err)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = AuthRoutes
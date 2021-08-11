const Joi = require('joi');
const Boom = require('boom');
const BaseRoute = require('./BaseRoute')
const JWT = require('jsonwebtoken');
const PasswordHelper = require('../../helpers/passwordHelper')

const failAction = (request, h, erro) => {
    throw erro
}

const USER = {
    username: 'lucasamorim',
    password: 'minhasenhasecreta'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db){
        super()
        this.secret = secret
        this.db = db
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
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, _h, _err) => {
                try{
                    const { username, password } = request.payload
                    // console.log('password', password)
                    const [usuario] = await this.db.read({
                        username: username.toLowerCase()
                    })
                    
                    if(!usuario) return Boom.unauthorized('O usuario informado não existe')
                    // if (username.toLowerCase() !== USER.username || password.toLowerCase() !== USER.password) {
                    //     return Boom.unauthorized()
                    // }
                    
                    const match = await PasswordHelper.comparePassword(password, usuario.password)
                    
                    if (!match) return Boom.unauthorized('Usuário ou Senha inválida')

                    const token = JWT.sign({username, id: usuario.id}, this.secret)

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
const BaseRoute = require('./BaseRoute')
class HeroRoutes extends BaseRoute{
    constructor(db){
        super()
        this.db = db
    }
    list(){
        return {
            method: 'GET',
            path: '/herois',
            handler: (request, h) => {
                try{
                    const { nome, skip = 0, limit = 10 } = request.query
                    // console.log('skip', typeof(skip))
                    // console.log('limit', limit)
                    // console.log('nome',nome)

                    let query = {}
                    if (nome) query.nome = nome
                    if (isNaN(skip))
                        throw Error('skip must be positive number')
                    if (isNaN(limit))
                        throw Error('limit must be positive number')
                    return this.db.read(query, parseInt(skip), parseInt(limit))
                }catch(error){
                    console.log('Algum erro', error);
                    return 'Erro interno no servidor'
                }
                
            }
        }
    }
}

module.exports = HeroRoutes
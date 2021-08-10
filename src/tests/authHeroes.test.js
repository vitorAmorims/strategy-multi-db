const assert = require('assert');
const api = require('../api')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const UsuarioSchema = require('../db/strategies/postgres/schemas/usuarioSchema')
let app = {}

const USER = {
    username: 'lucasamorim',
    password: 'minhasenhasecreta'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$TqbN5L9i1Izm.vcd1u4vlu5zc9/WCthZOkgSO5v3RNW7G2T3fPA6q'
}

describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api
        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
        const context = new Context(new Postgres(connectionPostgres, model))
        await context.update(null, USER_DB, true)
    })
    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })
    it('retornar não autorizado com usuario não cadastrado na base', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'vitor',
                password: '123'
            }
        })
        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
        // console.log(data)
        assert.deepStrictEqual(statusCode, 401)
        assert.ok(data.error === 'Unauthorized')
    })
})
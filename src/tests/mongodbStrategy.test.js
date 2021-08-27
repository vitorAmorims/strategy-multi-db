const assert = require('assert');
const MongoDBAbstract = require('../db/strategies/mongodb/mongodb')
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

let context = {}

const MOCK_HEROI_CADASTRAR = {
    nome: "SuperMan",
    poder: "todos possiveis"
}

const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: "teia"
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: "velocidade"
}

const MOCK_HEROI_ATUALIZADO = {
    nome: "Patolino-1628094598445",
    poder: "super-força"
}

describe('mongoDB Strategy suite de testes', function (){
    this.beforeAll(async () => {
        
        const connection = MongoDBAbstract.connect()
        context = new Context(new MongoDBAbstract(connection, HeroiSchema))

        await context.create(MOCK_HEROI_DEFAULT)
        await context.create(MOCK_HEROI_ATUALIZAR)
    })
    it('mongoDB connection', async function(){
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })
    it('cadastrar', async function(){
        const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepStrictEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })
    it('listar', async () => {
        const [result] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
        const {nome, poder} = result
        assert.deepStrictEqual({nome, poder}, MOCK_HEROI_DEFAULT)
    })
    it('atualizar o poder', async () => {
        const [result] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        MOCK_HEROI_ID = result.id
        await context.update(MOCK_HEROI_ID, {poder: 'super-força'})
        const [resultAtualizado] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        const {poder} = resultAtualizado
        assert.deepStrictEqual(poder, MOCK_HEROI_ATUALIZADO.poder)
    })
    it('Delete', async () => {
        const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        MOCK_HEROI_ID = result.id
        const resultDeleted = await context.delete(MOCK_HEROI_ID)
        assert.deepStrictEqual(resultDeleted.n, 1)
    })
})
// ao Senhor, toda honra e toda glória!!
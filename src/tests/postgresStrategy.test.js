const assert = require('assert');
const Postgres = require('../db/strategies/postgres/postgres')
const HeroiSchema = require('../db/strategies/postgres/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

// const context = new Context(new Postgres());
const MOCK_HEROI_CADASTRAR = {
    nome: "Hulk",
    poder: "força"
}

const MOCK_HEROI_ATUALIZAR = {
    nome: "Batman",
    poder: "dinheiro"
}

let context = {}

describe('postgres strategy Suite de testes', function () {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection  = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)
        context = new Context(new Postgres(connection, model)) 
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
    })
    it('PostgresSQL connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('cadastrar', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('listar os herois', async () => {
        const [result] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome})
        delete result.id
        assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('atualizar', async () => {
        const [itemAtualizar] =  await context.read({ nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR, nome: "Mulher maravilha"
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })
        assert.deepStrictEqual(result, 1)
        assert.deepStrictEqual(itemAtualizado.nome, novoItem.nome)
    })
    it('remover por id', async () => {
        const [item] = await context.read({})
        const result  = await context.delete(item.id)
        assert.deepStrictEqual(result, 1)
    })
})
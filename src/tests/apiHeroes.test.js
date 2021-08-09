const assert = require("assert");
const api = require("../api");
let app = {};
const MOCK_HEROI_CADASTRAR = {
    nome: 'Lucas capitao cueca',
    poder: 'Molhar o colchão'
}
const MOCK_HEROI_DEFAULT = {
    nome: 'Lanterna Verde',
    poder: 'O poder do anel'
}

let MOCK_ID;

describe("Suite de teste da api Heroes", function () {
  this.beforeAll(async () => {
    app = await api;
    const dados = await app.inject({
        method: 'POST',
        url: '/herois',
        payload: MOCK_HEROI_DEFAULT
    })
    const dadosObject = JSON.parse(dados.payload);
    MOCK_ID = dadosObject.data._id;
    // console.log(MOCK_ID);
  });
  it("listar /herois", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/herois?skip=0&limit=10",
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });
  it("listar /herois - deve retornar somente 3 registros", async () => {
    const TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });
    const data = JSON.parse(result.payload);

    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(data.length === TAMANHO_LIMITE);
  });
  it("listar /herois - deve retornar erro ao inserir skip ou limit isNAN", async () => {
    const TAMANHO_LIMITE = "aaaaaaa";
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const objErroMsg = result.payload;

    const errorResult = {
      statusCode: 400,
      error: "Bad Request",
      message: 'child "limit" fails because ["limit" must be a number]',
      validation: {
        source: "query",
        keys: ["limit"],
      },
    };

    assert.deepStrictEqual(objErroMsg, JSON.stringify(errorResult));
  });
  it("listar GET /herois - deve pesquisar uma nome nos primeiros 1000 registros", async () => {
    const TAMANHO_LIMITE = 1000;
    let nome;
    const result = await app.inject({
      method: "GET",
      url: `/herois`,
    });

    const data = JSON.parse(result.payload);
    nome = data[0].nome;

    const result1 = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}&nome=${nome}`,
    });

    const objectData = JSON.parse(result1.payload);
    const statusCode = result1.statusCode;

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(nome === objectData[0].nome);
  });
  it('cadastrar POST /herois', async () => {
    const result = await app.inject({
        method: "POST",
        url: `/herois`,
        payload: MOCK_HEROI_CADASTRAR
    });
    // console.log('resultado', result.payload)
    const statusCode = result.statusCode
    const {data, message} = JSON.parse(result.payload)
    
    assert.ok(statusCode === 200)
    assert.notStrictEqual(data._id, undefined)
    assert.deepStrictEqual(message, 'Cadastro realizado com sucesso')

  })
  it('Deve atualizar PATCH /herois', async function () {
    const MOCK_HEROI_ATUALIZAR = {
        poder: "Voar"
    }
    const result = await app.inject({
        method: "PATCH",
        url: `/herois/${MOCK_ID}`,
        payload: JSON.stringify(MOCK_HEROI_ATUALIZAR)
    });
    const statusCode = result.statusCode
    const data = JSON.parse(result.payload);
    // console.log('result', result.payload);
    assert.ok(statusCode === 200);
    assert.deepStrictEqual(data.message, 'Atualização realizada com sucesso')
  })
  it('Não deve atualizar PATCH /herois', async () => {
    MOCK_ID = '61114ddc855c7f76c33b6497'
    const MOCK_HEROI_ATUALIZAR = {
        poder: "LASER"
    }
    const result = await app.inject({
        method: "PATCH",
        url: `/herois/${MOCK_ID}`,
        payload: JSON.stringify(MOCK_HEROI_ATUALIZAR)
    });
    const statusCode = result.statusCode
    const data = JSON.parse(result.payload)

    assert.ok(statusCode === 200);
    assert.deepStrictEqual(data.message, 'Não foi possível atualizar!')
  })
});

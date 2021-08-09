const assert = require("assert");
const api = require("../api");
let app = {};

describe("Suite de teste da api Heroes", function () {
  this.beforeAll(async () => {
    app = await api;
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
  it("listar /herois - deve pesquisar uma nome nos primeiros 1000 registros", async () => {
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
});

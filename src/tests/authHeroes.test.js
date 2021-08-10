const assert = require('assert');
const api = require('../api')
let app = {}

describe.only('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api
    })
    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'lucasamorim',
                password: 'minhasenhasecreta'
            }
        })
        const statusCode = result.statusCode;

        const data = JSON.parse(result.payload)
        // console.log(data)
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })
})
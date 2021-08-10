const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'minhasenhasecreta'

describe.only('UseHelper test suite', function() {
    it('deve gerar um hash a partir da senha', async function() {
        const result = await PasswordHelper.hasPassword(SENHA)
        // console.log('result', result)
        assert.ok(result.length > 10)
    })
})
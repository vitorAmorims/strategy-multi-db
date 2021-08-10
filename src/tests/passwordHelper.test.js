const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'minhasenhasecreta'
const HASH = '$2b$04$TqbN5L9i1Izm.vcd1u4vlu5zc9/WCthZOkgSO5v3RNW7G2T3fPA6q'

describe('UseHelper test suite', function() {
    it('deve gerar um hash a partir da senha', async function() {
        const result = await PasswordHelper.hasPassword(SENHA)
        // console.log('result', result)
        assert.ok(result.length > 10)
    })
    it('deve validar a senha a partir do hash', async function() {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        // console.log('result', result)
        assert.ok(result === true)
    })
})
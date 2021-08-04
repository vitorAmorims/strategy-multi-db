const ContextStrategy = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const Postgres = require('./db/strategies/postgres/postgres');

// const objMongoDB = new MongoDB();
// objMongoDB.create("alguma coisa")

// const objPostgres = new Postgres();
// objPostgres.create("alguma postgres")

const objContextStrategyMongo = new ContextStrategy(new MongoDB());

const objContextStrategyPostgres = new ContextStrategy(new Postgres());

objContextStrategyMongo.create("salvar alguma coisa no mongodb")
objContextStrategyPostgres.create("salvar alguma coisa no postgres")

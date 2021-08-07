const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy')

const MongoDb =  require('./db/strategies/mongodb/mongodb')
const HeroiSchemaMongo = require('./db/strategies/mongodb/schemas/heroisSchema')

const Postgres = require('./db/strategies/postgres/postgres')
const HeroisSchemaPostgres = require('./db/strategies/postgres/schemas/heroisSchema')

const init = async () => {
    // const connection = MongoDb.connect()
    // const context = new Context(new MongoDb(connection, HeroiSchemaMongo))

    const connection = Postgres.connect()
    const context = new Context(new Posrgres(connection, HeroisSchemaPostgres))

    const server = Hapi.server({
        port: 5001,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/herois',
        handler: (request, h) => {

            return context.read()
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

// http GET localhost:5001/herois
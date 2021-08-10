const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb =  require('./db/strategies/mongodb/mongodb')
const HeroiSchemaMongoDb = require('./db/strategies/mongodb/schemas/heroisSchema');
const Postgres = require('./db/strategies/postgres/postgres')
const HeroiSchemaPostgres = require('./db/strategies/postgres/schemas/heroisSchema')
const HeroRoutes = require('./routes/base/HeroRoutes')
const AuthRoutes = require('./routes/base/AuthRoute')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const JWT_SECRET = 'minhasenhasecreta'
const HapiJwt = require('hapi-auth-jwt2')

function mapRoutes(instance, methods){
    // console.log('instance: ', instance)
    // console.log('methods: ', methods)
    return methods.map(method => instance[method]())
}

const init = async () => {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchemaMongoDb))
    // const connection = await Postgres.connect()
    // const context = new Context(new Postgres(connection, HeroiSchemaPostgres))
    // console.log('context', context)

    const swaggerOptions = {
        info: {
            title: 'API HEROIS - CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    const server = Hapi.server({
        port: 5001,
        host: 'localhost'
    });

    await server.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 3600 *
        // }
        validate: (dado, request) => {
            //verificar se o usuário continua ativo
            //veriricar se o usuario continua pagando
            return {
                isValid: true //caso nao válido false
            }
        }
    })

    server.auth.default('jwt')

    server.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);

    return server
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

module.exports = init();
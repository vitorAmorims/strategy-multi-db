const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || 'dev'
ok(env === 'prod' || env === 'dev', 'a env é inválida, ou dev ou prod')

const configPath = join(__dirname, './config', `.env.${env}`)

config({
    path: configPath,
})

const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb =  require('./db/strategies/mongodb/mongodb')
const HeroiSchemaMongoDb = require('./db/strategies/mongodb/schemas/heroisSchema');
const Postgres = require('./db/strategies/postgres/postgres')
const UsuarioSchemaPostgres = require('./db/strategies/postgres/schemas/usuarioSchema')
const HeroRoutes = require('./routes/base/HeroRoutes')
const AuthRoutes = require('./routes/base/AuthRoute')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const JWT_SECRET = process.env.JWT_KEY
const HapiJwt = require('hapi-auth-jwt2')

function mapRoutes(instance, methods){
    // console.log('instance: ', instance)
    // console.log('methods: ', methods)
    return methods.map(method => instance[method]())
}

const init = async () => {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroiSchemaMongoDb))
    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchemaPostgres)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

    const swaggerOptions = {
        info: {
            title: 'API HEROIS - CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }

    const server = Hapi.server({
        port: process.env.PORT,
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
        validate: async (data, request) => {
            const [result] = await contextPostgres.read({
                username: data.username.toLowerCase(),
            })

            //verificar se o usuário continua ativo
            if(!result) return { isValid: false }
            
            //veriricar se o usuario continua pagando

            return {
                isValid: true
            }
        }
    })

    server.auth.default('jwt')

    server.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
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
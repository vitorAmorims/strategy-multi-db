const {join} = require('path')
const BaseRoute = require('./BaseRoute')

class UtilRoutes extends BaseRoute {
    coverage(){
        return {
            path: '/coverage/{params*}',
            method: 'GET',
            config: {
                auth: false
            },
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}
module.exports = UtilRoutes


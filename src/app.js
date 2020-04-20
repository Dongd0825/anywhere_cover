const http = require('http')
const path = require('path')
const conf= require('./config/defaultConfig')
const route = require('./helper/route')
const chalk = require('chalk')
const openUrl = require('./helper/openUrl')

//静态资源服务器
class Server{
    constructor(config) {
        this.conf = Object.assign({}, conf, config)
    }
    start(){
        const server = http.createServer(async (req, res) => {
            const filePath = path.join(this.conf.root, req.url)
            route(req, res, filePath, this.conf)
        })
        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`
            openUrl(addr)
            console.info(`Server started at' ${chalk.green(addr)}`)
        })
    }
}
module.exports = Server

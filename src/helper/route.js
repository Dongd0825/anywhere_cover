const fs = require('fs') 
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify;
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())
// const config = require('../config/defaultConfig')
const compress = require('./compress')
const range = require('../helper/range')
const isFresh = require('./cache')

module.exports = async function(req, res, filePath, config) {
    try {
        const stats = await stat(filePath)
        console.log('stats',stats)
        if (stats.isFile()) {
            res.setHeader('content-type', 'text/plain; charset=utf-8')
            if (isFresh(stats, req, res)) {
                res.statusCode = 304
                res.end()
                return
            }
            res.statusCode = 200
            let rs;
            
            const { code, start, end } = range(stats.size, req, res)
            if (code === 206) {
                rs = fs.createReadStream(filePath, {
                    start,
                    end
                })
            } else if (code === 200) {
                rs = fs.createReadStream(filePath)
            }

            const fileType = path.extname(filePath)

            if (config.compress.test(fileType)) {
                rs = compress(rs, req, res)
            }
            rs.pipe(res)
            // res.end(rs)
            // fs.readFile(filePath, (err, data) => { // 一起输出
            //     if (err) {
            //         res.end('err')
            //         return
            //     }
            //     res.end(data)
            // })
            // fs.createReadStream(filePath).pipe(data)//渐进式输出数据
        } else if (stats.isDirectory()) {
            const files = await readdir(filePath)
            res.statusCode = 200
            res.setHeader('content-type', 'text/html; charset=utf-8')
            const dir = path.relative(config.root,filePath)
            res.end(template({
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '', //相对于根目录
                files
            }) )
        }
    } catch(e) {
        if (e) {
            res.statusCode = 404
            res.setHeader('content-type', 'text/plain')
            res.end(`${filePath} is not a directory or file ${e.toString()}`)
        }
    }
}
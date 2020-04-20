const cache = require('../config/defaultConfig').cache

function refreshRes(stats, res) {
    const {exprise, maxAge, cacheControl, etag, lastModified} = cache;
    if (exprise) {
        res.setHeader('exprise', new Date(Date.now() + maxAge * 10000).toUTCString())
    }

    if (cacheControl) {
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
    }

    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString())
    }

    if (etag) {
        res.setHeader('Etag', `${stats.size}-${stats.mtime}`)
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res)

    const lastModified = req.headers['If-Modified-Since']
    const etag = req.headers['if-none-match']
    if (!lastModified && !etag) {
        return false
    }

    if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
        return false
    }

    if (etag && etag !== res.getHeader('Etag')) {
        return false
    }

    return true
}

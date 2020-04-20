module.exports = function(totalSize, req, res) {
    const range = req.headers.range
    if (!range) {
        return {
            code: 200
        }
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/)
    const end = sizes[2] || totalSize -1
    const start = sizes[1] || totalSize - end
    if (start < 0 || end < 0 || start > end || end > totalSize) {
        return {
            code: 200
        }
    }

    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Content-Range',`bytes ${start}-${end}/${totalSize}`)
    res.setHeader('Content-Lenght', end - start)
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
}
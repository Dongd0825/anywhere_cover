module.exports = {
    root: process.cwd(),
    compress: /.(html|js|css|md)/,
    hostname: '127.0.0.1',
    port:3000,
    cache: {
        maxAge: 600,
        exprise: true,
        cacheControl: true,
        lastModified: true, 
        etag: true
    }
}
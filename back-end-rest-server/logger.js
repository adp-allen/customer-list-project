const fs = require('fs')
const path = require('path')

class Logger {
    constructor(filename = 'server.log') {
        this.logPath = path.join(__dirname, filename)
    }

    log(message) {
        console.log(message)
        const entry = `[${new Date().toISOString()}] ${message}\n`
        fs.appendFile(this.logPath, entry, err => {
            if (err) console.error('Logger error:', err)
        })
    }
}

module.exports = Logger

const crypto = require('crypto')

const tokens = []

function generateToken() {
    // 32 random bytes as hex string
    const token = crypto.randomBytes(32).toString('hex')
    tokens.push(token)
    return token
}

function verifyToken(token) {
    return tokens.includes(token)
}

function removeToken(token) {
    const idx = tokens.indexOf(token)
    if (idx !== -1) tokens.splice(idx, 1)
}

module.exports = {
    generateToken,
    verifyToken,
    removeToken,
    tokens // for debugging/testing
}

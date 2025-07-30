const { generateToken, verifyToken, removeToken, tokens } = require('./auth')

describe('auth.js', () => {
  beforeEach(() => {
    // Clear tokens before each test
    tokens.length = 0
  })

  it('should generate a token and store it', () => {
    const token = generateToken()
    expect(typeof token).toBe('string')
    expect(token.length).toBe(64)
    expect(tokens).toContain(token)
  })

  it('should verify a valid token', () => {
    const token = generateToken()
    expect(verifyToken(token)).toBe(true)
  })

  it('should not verify an invalid token', () => {
    expect(verifyToken('not-a-token')).toBe(false)
  })

  it('should remove a token', () => {
    const token = generateToken()
    expect(tokens).toContain(token)
    removeToken(token)
    expect(tokens).not.toContain(token)
  })
})

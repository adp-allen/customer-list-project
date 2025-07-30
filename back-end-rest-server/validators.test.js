const { validateEmail, validateName, validatePassword } = require('./validators')

describe('validators.js', () => {
  it('should validate correct emails', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('a.b-c@foo.bar')).toBe(true)
  })

  it('should invalidate incorrect emails', () => {
    expect(validateEmail('not-an-email')).toBe(false)
    expect(validateEmail('foo@bar')).toBe(false)
    expect(validateEmail('foo@bar.')).toBe(false)
  })

  it('should validate correct names', () => {
    expect(validateName('John Doe')).toBe(true)
    expect(validateName('Alice')).toBe(true)
  })

  it('should invalidate incorrect names', () => {
    expect(validateName('John123')).toBe(false)
    expect(validateName('!@#')).toBe(false)
    expect(validateName('')).toBe(false)
  })

  it('should validate strong passwords', () => {
    expect(validatePassword('Abcdef1!')).toBe(true)
    expect(validatePassword('XyZ123$')).toBe(true)
  })

  it('should invalidate weak passwords', () => {
    expect(validatePassword('abcdef')).toBe(false)
    expect(validatePassword('ABCDEF')).toBe(false)
    expect(validatePassword('123456')).toBe(false)
    expect(validatePassword('abcABC')).toBe(false)
    expect(validatePassword('abc123')).toBe(false)
    expect(validatePassword('Abcdef')).toBe(false)
    expect(validatePassword('Abcdef1')).toBe(false)
  })
})

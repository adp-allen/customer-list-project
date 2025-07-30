const fs = require('fs')
const path = require('path')
const Logger = require('./logger')

describe('Logger', () => {
  const testLogFile = 'test-server.log'
  const testLogPath = path.join(__dirname, testLogFile)
  let logger

  beforeEach(() => {
    // Remove log file before each test
    if (fs.existsSync(testLogPath)) fs.unlinkSync(testLogPath)
    logger = new Logger(testLogFile)
  })

  it('should write a log entry to the file', done => {
    logger.log('Hello World')
    setTimeout(() => {
      const content = fs.readFileSync(testLogPath, 'utf-8')
      expect(content).toMatch(/Hello World/)
      done()
    }, 50)
  })

  it('should include a timestamp in the log entry', done => {
    logger.log('Timestamp Test')
    setTimeout(() => {
      const content = fs.readFileSync(testLogPath, 'utf-8')
      expect(content).toMatch(/\[\d{4}-\d{2}-\d{2}T/) // ISO date
      done()
    }, 50)
  })

  it('should log multiple messages', done => {
    logger.log('First')
    logger.log('Second')
    setTimeout(() => {
      const content = fs.readFileSync(testLogPath, 'utf-8')
      expect(content).toMatch(/First/)
      expect(content).toMatch(/Second/)
      done()
    }, 100)
  })
})

const fs = require('fs')
const path = require('path')
const { exportToCSV, exportToXLSX } = require('./exportData')
const JsonDatabase = require('./db')

describe('exportData', () => {
  const dataPath = path.join(__dirname, 'data.json')
  const csvPath = path.join(__dirname, 'customers.csv')
  const xlsxPath = path.join(__dirname, 'customers.xlsx')
  const testData = {
    customers: [
      { id: '1', name: 'A', email: 'a@a.com', password: 'Test1!' },
      { id: '2', name: 'B', email: 'b@b.com', password: 'Test2@' }
    ]
  }

  beforeEach(() => {
    fs.writeFileSync(dataPath, JSON.stringify(testData, null, 2))
    if (fs.existsSync(csvPath)) fs.unlinkSync(csvPath)
    if (fs.existsSync(xlsxPath)) fs.unlinkSync(xlsxPath)
  })

  it('should export customers to CSV', async () => {
    await exportToCSV()
    expect(fs.existsSync(csvPath)).toBe(true)
    const content = fs.readFileSync(csvPath, 'utf-8')
    expect(content).toMatch(/name,email,password/)
    expect(content).toMatch(/A/)
    expect(content).toMatch(/B/)
  })

  it('should export customers to XLSX', async () => {
    await exportToXLSX()
    expect(fs.existsSync(xlsxPath)).toBe(true)
    // XLSX file is binary, just check file exists and is not empty
    const stats = fs.statSync(xlsxPath)
    expect(stats.size).toBeGreaterThan(0)
  })

  it('should log and not export if no customers', async () => {
    fs.writeFileSync(dataPath, JSON.stringify({ customers: [] }, null, 2))
    await exportToCSV()
    expect(fs.existsSync(csvPath)).toBe(false)
    await exportToXLSX()
    expect(fs.existsSync(xlsxPath)).toBe(false)
  })
})

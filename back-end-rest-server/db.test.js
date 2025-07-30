const fs = require('fs')
const path = require('path')
const JsonDatabase = require('./db')

describe('JsonDatabase', () => {
  const dataPath = path.join(__dirname, 'test-data.json')
  let db
  const initialData = {
    customers: [
      { id: '1', name: 'A', email: 'a@a.com', password: 'Test1!' },
      { id: '2', name: 'B', email: 'b@b.com', password: 'Test2@' }
    ]
  }

  beforeEach(() => {
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2))
    db = new JsonDatabase('test-data.json')
  })

  it('should read all customers', async () => {
    const all = await db.readAll()
    expect(all.length).toBe(2)
    expect(all[0].name).toBe('A')
  })

  it('should read customer by id', async () => {
    const customer = await db.readById('1')
    expect(customer).toBeDefined()
    expect(customer.name).toBe('A')
  })

  it('should add a customer', async () => {
    const newCustomer = { name: 'C', email: 'c@c.com', password: 'Test3#' }
    const added = await db.add(newCustomer)
    expect(added.name).toBe('C')
    const all = await db.readAll()
    expect(all.length).toBe(3)
  })

  it('should update a customer by id', async () => {
    const updated = await db.updateById('1', { name: 'AA' })
    expect(updated.name).toBe('AA')
    const customer = await db.readById('1')
    expect(customer.name).toBe('AA')
  })

  it('should delete a customer by id', async () => {
    const filtered = await db.deleteById('1')
    expect(filtered.length).toBe(1)
    expect(filtered[0].id).toBe('2')
  })

  it('should return null when updating non-existent id', async () => {
    const result = await db.updateById('999', { name: 'X' })
    expect(result).toBeNull()
  })
})

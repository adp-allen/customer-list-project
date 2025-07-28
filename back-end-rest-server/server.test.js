const request = require('supertest')
const express = require('express')
const JsonDatabase = require('./db')

// Setup Express app for testing
const app = express()
app.use(express.json())
const customerDb = new JsonDatabase('data.json')

// Handlers (same as in server.js)
app.get('/customers', async (req, res) => {
    try {
        const customers = await customerDb.readAll()
        res.json(customers)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers.' })
    }
})
app.get('/customers/:id', async (req, res) => {
    try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const customer = await customerDb.readById(id)
        if (!customer) return res.status(404).json({ error: 'Customer not found.' })
        res.json(customer)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customer.' })
    }
})
app.post('/customers', async (req, res) => {
    try {
        const newCustomer = await customerDb.add(req.body)
        res.status(201).json(newCustomer)
    } catch (err) {
        res.status(500).json({ error: 'Failed to add customer.' })
    }
})
app.put('/customers/:id', async (req, res) => {
    try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const updated = await customerDb.updateById(id, req.body)
        if (!updated) return res.status(404).json({ error: 'Customer not found.' })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: 'Failed to update customer.' })
    }
})
app.delete('/customers/:id', async (req, res) => {
    try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const result = await customerDb.deleteById(id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer.' })
    }
})

// Jest tests

describe('Customer API Handlers', () => {
    it('GET /customers should return all customers', async () => {
        const res = await request(app).get('/customers')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it('GET /customers/:id should return a customer by id', async () => {
        const res = await request(app).get('/customers/0')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('id', 0)
    })

    it('POST /customers should add a new customer', async () => {
        const newCustomer = { name: 'Test User', email: 'test@abc.com', password: 'testpass' }
        const res = await request(app).post('/customers').send(newCustomer)
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('name', 'Test User')
    })

    it('PUT /customers/:id should update a customer', async () => {
        const update = { name: 'Updated Name' }
        const res = await request(app).put('/customers/0').send(update)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('name', 'Updated Name')
    })

    it('DELETE /customers/:id should delete a customer', async () => {
        const res = await request(app).delete('/customers/0')
        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it('GET /customers/:id should return 404 for missing customer', async () => {
        const res = await request(app).get('/customers/99999')
        expect(res.statusCode).toBe(404)
    })
})

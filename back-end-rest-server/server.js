// imports
const express = require('express')
const cors = require('cors')
const JsonDatabase = require('./db')
const { exportToCSV, exportToXLSX } = require('./exportData')
const Logger = require('./logger')
const { validateEmail, validateName, validatePassword } = require('./validators')
const { generateToken, verifyToken } = require('./auth')
const fs = require('fs').promises
const path = require('path')

// create app
const app = express()
const port = 3000
const logger = new Logger()

// import json data storage
const customerDb = new JsonDatabase('data.json')

// middleware
app.use(express.json())
app.use(cors())

// Logger middleware
app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`)
    next()
})

// Auth middleware
function authMiddleware(req, res, next) {
    // Token from Authorization header
    const token = req.headers.authorization
    if (!token || !verifyToken(token)) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
}

// static assets and routing


// create handlers
// Login handler
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const adminsPath = path.join(__dirname, 'admins.json')
        const raw = await fs.readFile(adminsPath, 'utf-8')
        const { admins } = JSON.parse(raw)
        const found = admins.find(a => a.username === username && a.password === password)
        if (!found) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const token = generateToken()
        res.json({ token })
    } catch (err) {
        res.status(500).json({ error: 'Login failed' })
    }
})
// -----------------
// Get all customers
app.get('/customers', async (req, res) => {
    try {
        const customers = await customerDb.readAll()
        res.json(customers)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers.' })
    }
})

// Get customer by id
app.get('/customers/:id', authMiddleware, async (req, res) => {
    try {
        // id in data.json is a number, so convert to number for search
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const customer = await customerDb.readById(id)
        if (!customer) return res.status(404).json({ error: 'Customer not found.' })
        res.json(customer)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customer.' })
    }
})

// Add new customer
app.post('/customers', authMiddleware, async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' })
        }
        if (!validateName(name)) {
            return res.status(400).json({ error: 'Name must contain only letters and spaces.' })
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must have uppercase, lowercase, number, special character, and be at least 6 characters.' })
        }
        const newCustomer = await customerDb.add(req.body)
        res.status(201).json(newCustomer)
    } catch (err) {
        res.status(500).json({ error: 'Failed to add customer.' })
    }
})

// Update customer by id
app.put('/customers/:id', authMiddleware, async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.' })
        }
        if (!validateName(name)) {
            return res.status(400).json({ error: 'Name must contain only letters and spaces.' })
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must have uppercase, lowercase, number, special character, and be at least 6 characters.' })
        }
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const updated = await customerDb.updateById(id, req.body)
        if (!updated) 
            return res.status(404).json({ error: 'Customer not found.' })
        res.json(updated)
    } catch (err) {
        res.status(500).json({ error: 'Failed to update customer.' })
    }
})

// Delete customer by id
app.delete('/customers/:id', authMiddleware, async (req, res) => {
    try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const result = await customerDb.deleteById(id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer.' })
    }
})


// Download customers.csv
app.get('/export/csv', authMiddleware, async (req, res) => {
    try {
        await exportToCSV()
        const filePath = require('path').join(__dirname, 'customers.csv')
        res.download(filePath, 'customers.csv', err => {
            if (err) res.status(500).json({ error: 'Failed to download CSV.' })
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to export CSV.' })
    }
})

// Download customers.xlsx
app.get('/export/xlsx', authMiddleware, async (req, res) => {
    try {
        await exportToXLSX()
        const filePath = require('path').join(__dirname, 'customers.xlsx')
        res.download(filePath, 'customers.xlsx', err => {
            if (err) res.status(500).json({ error: 'Failed to download Excel.' })
        })
    } catch (err) {
        res.status(500).json({ error: 'Failed to export Excel.' })
    }
})

// Download raw JSON data
app.get('/export/json', authMiddleware, (req, res) => {
    const filePath = require('path').join(__dirname, 'data.json');
    res.download(filePath, 'data.json', err => {
        if (err) res.status(500).json({ error: 'Failed to download JSON.' });
    });
});



// start server
app.listen(port, () => {
    logger.log(`Server is running on port: ${port}`)
})

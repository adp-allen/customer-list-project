// imports
const express = require('express')
const cors = require('cors')
const JsonDatabase = require('./db')
const { exportToCSV, exportToXLSX } = require('./exportData')

// create app
const app = express()
const port = 3000

// import json data storage
const customerDb = new JsonDatabase('data.json')

// middleware
app.use(express.json())
app.use(express.text())
app.use(cors())

// static assets and routing


// create handlers
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
app.get('/customers/:id', async (req, res) => {
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
app.post('/customers', async (req, res) => {
    try {
        const newCustomer = await customerDb.add(req.body)
        res.status(201).json(newCustomer)
    } catch (err) {
        res.status(500).json({ error: 'Failed to add customer.' })
    }
})

app.post('/api/customers', express.text({ type: 'text/plain' }), async (req, res) => {
    try {
        const csvData = req.body; // Expecting raw CSV data in the request body
        const rows = csvData.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(header => header.trim());

        // Validate headers
        if (headers.length !== 3 || headers[0] !== 'customerName' || headers[1] !== 'Username' || headers[2] !== 'Password') {
            return res.status(400).json({ error: 'Invalid CSV format. Expected headers: customerName, Username, Password' });
        }

        // Parse rows into customer objects
        const customers = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim());
            return {
                name: values[0],
                email: values[1],
                password: values[2],
            };
        });

        // Add customers to the database
        for (const customer of customers) {
            await new Promise(resolve => setTimeout(resolve, 10));
            await customerDb.add(customer);
        }

        res.status(200).json({ message: 'Customers added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process the CSV file.' });
    }
});

// Update customer by id
app.put('/customers/:id', async (req, res) => {
    try {
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
app.delete('/customers/:id', async (req, res) => {
    try {
        const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id)
        const result = await customerDb.deleteById(id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer.' })
    }
})


// Download customers.csv
app.get('/export/csv', async (req, res) => {
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
app.get('/export/xlsx', async (req, res) => {
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
app.get('/export/json', (req, res) => {
    const filePath = require('path').join(__dirname, 'data.json');
    res.download(filePath, 'data.json', err => {
        if (err) res.status(500).json({ error: 'Failed to download JSON.' });
    });
});



// start server
app.listen(port, () => {
    console.log('Server is running on port: ', port)
})

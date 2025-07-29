const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');

async function exportToCSV() {
    const dataPath = path.join(__dirname, 'data.json');
    const outPath = path.join(__dirname, 'customers.csv');
    const raw = await fs.readFile(dataPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const customers = parsed.customers || [];

    if (customers.length === 0) {
        console.log('No customers to export.');
        return;
    }

    // Get all unique keys for header
    const keys = Array.from(new Set(customers.flatMap(obj => Object.keys(obj))));
    const header = keys.join(',');
    const rows = customers.map(obj => keys.map(k => JSON.stringify(obj[k] ?? '')).join(','));
    const csv = [header, ...rows].join('\n');

    await fs.writeFile(outPath, csv);
    console.log('Exported to customers.csv');
}

async function exportToXLSX() {
    const dataPath = path.join(__dirname, 'data.json');
    const outPath = path.join(__dirname, 'customers.xlsx');
    const raw = await fs.readFile(dataPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const customers = parsed.customers || [];

    if (customers.length === 0) {
        console.log('No customers to export.');
        return;
    }

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, outPath);
    console.log('Exported to customers.xlsx');
}

module.exports = {
    exportToCSV,
    exportToXLSX
}


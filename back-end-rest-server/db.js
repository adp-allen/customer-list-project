
const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

class JsonDatabase{
    // initialize object
    constructor(filename){
       this.filepath = path.join(__dirname, filename) 
    }

    // get all data
    async readAll(){
        try {
            const data = await fs.readFile(this.filepath, 'utf-8')
            const parsed = JSON.parse(data)
            return parsed.customers || []
        } catch (err) {
            throw err;
        }
    }

    // fetch item by id
    async readById(id){
        try {
            const items = await this.readAll()
            // id in data.json is a number, so ensure type match
            return items.find(item => item.id == id)
        } catch (err) {
            throw err;
        }
    }

    // delete item by id
    async deleteById(id){
        try {
            const data = await fs.readFile(this.filepath, 'utf-8')
            const parsed = JSON.parse(data)
            const items = parsed.customers || []

            const filtered = items.filter(item => item.id != id)
            parsed.customers = filtered

            await fs.writeFile(this.filepath, JSON.stringify(parsed, null, 2))
            return filtered
        } catch (err) {
            throw err;
        }
    }

    // create item
    async add(item){
        try {
            const data = await fs.readFile(this.filepath, 'utf-8')
            const parsed = JSON.parse(data)
            const items = parsed.customers || []

            // Use UUID for unique id
            item.id = item.id || uuidv4()
            items.push(item)
            parsed.customers = items

            await fs.writeFile(this.filepath, JSON.stringify(parsed, null, 2))
            return item
        } catch (err) {
            throw err;
        }
    }

    // update an item by id
    async updateById(id, newData){
        try {
            const data = await fs.readFile(this.filepath, 'utf-8')
            const parsed = JSON.parse(data)
            const items = parsed.customers || []
            const idx = items.findIndex(item => item.id == id)

            if (idx === -1) 
                return null
            items[idx] = { ...items[idx], ...newData, id: items[idx].id }
            parsed.customers = items

            await fs.writeFile(this.filepath, JSON.stringify(parsed, null, 2))
            return items[idx]
        } catch (err) {
            throw err;
        }
    }
}

module.exports = JsonDatabase
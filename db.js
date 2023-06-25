import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'database.json')

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file)
const defaultData = { cards: [], customFields: [], users: [] };

export default new Low(adapter, defaultData);

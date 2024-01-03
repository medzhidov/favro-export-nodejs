import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// db.json file path
// @ts-ignore
const file = import.meta.dir + '/database.json';

// Configure lowdb to write data to JSON file
const adapter = new JSONFile<typeof defaultData>(file)
const defaultData = {
    cards: [],
    customFields: [],
    widgets: [],
    users: [],
    tags: [],
    columns: [],
    collections: []
};

export default new Low<typeof defaultData>(adapter, defaultData);

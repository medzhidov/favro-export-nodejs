import db from "./db";
import {fetchCards} from "./api/cards.js";
import {fetchCollections} from "./api/collections.js";
import {fetchTags} from "./api/tags.js";
import {fetchWidgets} from "./api/widgets.js";
import {fetchColumns} from "./api/columns.js";
import {fetchCustomFields} from "./api/customFields.js";
import {fetchUsers} from "./api/users.js";

await db.read();

// Collections
console.log('==> Download Collections');
db.data.collections = await fetchCollections();

// Cards
db.data.cards = [];

for (const collection of db.data.collections) {
    console.log(`==> Download cards for collection ${collection.name}`);
    db.data.cards.push(...(await fetchCards(collection.collectionId, 0, null)));
}

// Tags
console.log('==> Download Tags');
db.data.tags = await fetchTags();

// Widgets
console.log('==> Download Widgets');
db.data.widgets = await fetchWidgets();

// Columns
console.log('==> Download Columns (statuses)');
db.data.columns = [];

for (const widget of db.data.widgets) {
    db.data.columns.push(...(await fetchColumns(widget.widgetCommonId)));
}

// Custom Fields
console.log('==> Download Custom Fields');
db.data.customFields = await fetchCustomFields();

// Users
console.log('==> Download Users');
db.data.users = await fetchUsers();

await db.write();


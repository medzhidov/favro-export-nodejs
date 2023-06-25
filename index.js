import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import db from "./db.js";
import fetch from 'node-fetch';
import {fetchCards} from "./api/cards.js";
import {fetchCollections} from "./api/collections.js";
import {fetchCustomFields} from "./api/customFields.js";
import {fetchTags} from "./api/tags.js";
import {fetchColumns} from "./api/columns.js";
import {fetchWidgets} from "./api/widgets.js";
import yargs from "yargs";
import './download.js';

await db.read();

// const {cards, collections, customFields, tags, columns, widgets} = db.data;
//
// const __dirname = dirname(fileURLToPath(import.meta.url))
// const file = join(__dirname, 'export/export.json')
//
// const exportData = JSON.stringify(cards.map(card => {
//     const collectionId = widgets.find(w => w.widgetCommonId === card.widgetCommonId)?.collectionIds[0];
//
//     card = {
//         collection: collections.find(c => c.collectionId === collectionId)?.name,
//         status: columns.find(c => c.columnId === card.columnId)?.name,
//         name: card.name,
//     };
//
//     return card;
// }), null, 4);
//
// writeFileSync(file, exportData);

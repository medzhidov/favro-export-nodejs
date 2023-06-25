import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import db from "./db.js";
// import './download.js';

await db.read();

const {cards, collections, customFields, tags, columns, widgets, users} = db.data;

const __dirname = dirname(fileURLToPath(import.meta.url))


const exportData = cards.map(card => {
    const collectionId = widgets.find(w => w.widgetCommonId === card.widgetCommonId)?.collectionIds[0];
    const parentCard = cards.find(c => c.cardId === card.parentCardId);
    const cardCustomFields = {};

    for (const customField of (card.customFields ?? [])) {
        const field = customFields.find(c => c.customFieldId === customField.customFieldId);

        if (!field) {
            continue;
        }

        const fieldName = field.name;
        let fieldValue = field.value;

        if (['Multiple select', 'Single select', 'Status', 'Tags', 'Members'].includes(field.type)) {
            fieldValue = customField.value.map(c => {
                return field.customFieldItems.find(cfi => cfi.customFieldItemId === c)?.name;
            });
        } else {
            fieldValue = customField.value;
        }

        cardCustomFields[fieldName] = fieldValue;
    }

    // console.log(cardCustomFields);

    card = {
        collection: collections.find(c => c.collectionId === collectionId)?.name,
        board: widgets.find(w => w.widgetCommonId === card.widgetCommonId)?.name,
        status: columns.find(c => c.columnId === card.columnId)?.name,
        name: card.name,
        parentCard: parentCard?.name,
        tags: card.tags.map(t => tags.find(tag => tag.tagId === t)?.name),
        assignments: card.assignments.map(a => users.find(u => u.userId === a.userId)?.name),
        content: card.detailedDescription,
        attachments: card.attachments.map(a => a.fileURL),
        startDate: card.startDate,
        dueDate: card.dueDate,
        ...cardCustomFields
    };

    return card;
});

writeFileSync(join(__dirname, 'export/json/export.json'), JSON.stringify(exportData, null, 4));

for (const widget of widgets) {
    const widgetCards = exportData.filter(c => c.board === widget.name);

    writeFileSync(join(__dirname, `export/json/groupByBoards/${widget.name.replace(/[^A-Za-zА-Яа-я0-9]/g, '')}.json`), JSON.stringify(widgetCards, null, 4));
}

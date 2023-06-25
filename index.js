import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';
import db from "./db.js";
import { json2csv } from "json-2-csv";
// import './download.js';

await db.read();

const {cards, collections, customFields, tags, columns, widgets, users} = db.data;

const __dirname = dirname(fileURLToPath(import.meta.url))

const uniqueCards = [...new Map(cards.map(item => [item['cardId'], item])).values()];

let exportData = uniqueCards.map(card => {
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
        } else if (field.type === 'Date') {
            fieldValue = customField.value?.date?.date;
        } else if (field.type === 'Link') {
            fieldValue = customField.link?.url;
        } else if (field.type === 'Color') {
            fieldValue = customField.color;
        } else if (field.type === 'Number') {
            fieldValue = customField.total;
        } else if (field.type === 'Text') {
            fieldValue = customField.value;
        } else {
            fieldValue = customField;
        }

        cardCustomFields[fieldName] = fieldValue;
    }

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

const prepareCsv = async (cards) => {
    const preparedCards = cards.map(c => {
        for (const field in c) {
            if (Array.isArray(c[field])) {
                c[field] = c[field].join(',');
            }

            if (c[field] === undefined || c[field] === null || c[field] === 'undefined') {
                c[field] = '';
            }
        }

        return c;
    });

    const csv = await json2csv(preparedCards);

    return csv.replaceAll('undefined', '');
};

writeFileSync(join(__dirname, 'export/json/export.json'), JSON.stringify(exportData, null, 4));
writeFileSync(join(__dirname, 'export/csv/export.csv'), await prepareCsv(exportData));

for (const widget of widgets) {
    const widgetCards = exportData.filter(c => c.board === widget.name);

    mkdirSync(join(__dirname, `export/json/groupByBoards`), {recursive: true});
    mkdirSync(join(__dirname, `export/csv/groupByBoards`), {recursive: true});

    writeFileSync(join(__dirname, `export/json/groupByBoards/${widget.name.replace(/[^A-Za-zА-Яа-я0-9\s]/g, '')}.json`), JSON.stringify(widgetCards, null, 4));
    writeFileSync(join(__dirname, `export/csv/groupByBoards/${widget.name.replace(/[^A-Za-zА-Яа-я0-9\s]/g, '')}.csv`), await prepareCsv(widgetCards));
}

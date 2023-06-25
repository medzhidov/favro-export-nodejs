import fetch from "node-fetch";
import db from "../db.js";
import {cliParams} from "../download.js";

const entities = [];

export const fetchCards = async (fPage = 0, fRequestId = null, collectionId) => {
    const params = {
        collectionId: collectionId,
        requestId: fRequestId,
        page: fPage,
        archived: false,
        descriptionFormat: "markdown",
    };

    const data = await fetch('https://favro.com/api/v1/cards?' + new URLSearchParams(params).toString(), {
        method: "GET",
        headers: {
            OrganizationId: "2cf01cab627b544f26ea742c",
            Authorization: 'Basic '+btoa(`${cliParams.email}:${cliParams.token}`),
        },
    })

    const response = await data.json();

    const { entities, limit, page, pages, requestId } = response;

    entities.push(...entities);

    console.log(`Page ${page + 1} of ${pages}, requestId: ${requestId}`);

    if (page < pages - 1) {
        return await fetchCards(page + 1, requestId, collectionId);
    }

    return entities;
};

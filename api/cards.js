import fetch from "node-fetch";
import env from "../env.js";

const cards = [];

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
            OrganizationId: env.organizationId,
            Authorization: 'Basic '+btoa(`${env.email}:${env.token}`),
        },
    })

    const response = await data.json();

    const { entities, limit, page, pages, requestId } = response;

    cards.push(...entities);

    if (page < pages - 1) {
        return await fetchCards(page + 1, requestId, collectionId);
    }

    return entities;
};

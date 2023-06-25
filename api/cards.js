import fetch from "node-fetch";
import env from "../env.js";

const items = [];

export const fetchCards = async (collectionId, fPage = 0, fRequestId = null) => {
    const params = {
        requestId: fRequestId,
        page: fPage,
        collectionId: collectionId,
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

    items.push(...entities);

    if (page < pages - 1) {
        return await fetchCards(collectionId, page + 1, requestId);
    }

    return entities;
};

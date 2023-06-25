import fetch from "node-fetch";
import env from "../env.js";

export const fetchColumns = async (widgetId) => {
    const params = {
        archived: false,
        widgetCommonId: widgetId
    };

    const data = await fetch('https://favro.com/api/v1/columns?' + new URLSearchParams(params).toString(), {
        method: "GET",
        headers: {
            OrganizationId: env.organizationId,
            Authorization: 'Basic '+btoa(`${env.email}:${env.token}`),
        },
    })

    const response = await data.json();
    const { entities, limit, page, pages, requestId } = response;
    return entities;
}

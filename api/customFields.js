import fetch from "node-fetch";
import env from "../env.js";

export const fetchCustomFields = async () => {
    const params = {
        archived: false,
    };

    const data = await fetch('https://favro.com/api/v1/customfields?' + new URLSearchParams(params).toString(), {
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

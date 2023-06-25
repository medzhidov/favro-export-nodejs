import fetch from "node-fetch";
import {cliParams} from "../download.js";

export const fetchCustomFields = async () => {
    const params = {
        archived: false,
    };

    const data = await fetch('https://favro.com/api/v1/customfields?' + new URLSearchParams(params).toString(), {
        method: "GET",
        headers: {
            OrganizationId: "2cf01cab627b544f26ea742c",
            Authorization: 'Basic '+btoa(`${cliParams.email}:${cliParams.token}`),
        },
    })

    const response = await data.json();
    const { entities, limit, page, pages, requestId } = response;

    return entities;
}

import env from "../env";

const items = [];

export const fetchCollections = async (fPage = 0, fRequestId = null) => {
    const params = {
        requestId: fRequestId,
        page: '' + fPage,
        archived: 'false',
    };

    const data = await fetch('https://favro.com/api/v1/collections?' + new URLSearchParams(params).toString(), {
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
        return await fetchCollections(page + 1, requestId);
    }

    return items;
}

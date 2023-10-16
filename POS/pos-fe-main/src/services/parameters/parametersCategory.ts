export function parametersUnitList(data) {
    let parameters =
    {
        keyword: data.keyword || "",
        category_id: data.category_id || 0,
        page_number: data.page_number || 0,
        page_size: data.page_size || 15,
        type: data.type || 0,                 
    }
    return parameters;
};

export function parametersPackingList(data) {
    let parameters =
    {
        keyword: data.keyword || "",
        category_id: data.category_id || 0,
        page_number: data.page_number || 0,
        page_size: data.page_size || 15,
        type: data.type || 0,                 
    }   
    return parameters;
};
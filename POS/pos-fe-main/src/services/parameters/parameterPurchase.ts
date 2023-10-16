export function parametersPurchaseList(data) {
    let parameters =
    {
        keyword: data.keyword || "",
        category_id: data.category_id || 0,
        page_number: data.page_number || 0,
        page_size: data.page_size || 15,
        type: data.type || 0,
        status_id: data.status_id || 0,        
        start_date: data.start_date || null,
        end_date: data.end_date || null
    }   
    return parameters;
};
export function parametersSupplierList(data) {
    let parameters =
    {
        keyword: data.keyword || "",
        supplier_id: data.supplier_id || 0,
        page_number: data.page_number || 0,
        page_size: data.page_size || 15,
        start_date: data.start_date || null,
        end_date: data.end_date || null,        
    }
    return parameters;
};

export function parametersSupplierReviewList(data) {
    let parameters =
    {
        keyword: data.keyword || "",
        supplier_id: data.supplier_id || 0,
        page_number: data.page_number || 0,
        page_size: data.page_size || 15,
        start_date: data.start_date || null,
        end_date: data.end_date || null,        
    }
    return parameters;
}
export interface ProductViewModel {
    id: number;
    userAdded: number;
    userUpdated: number | null;
    dateAdded: string;
    code: string;
    name: string | null;
    salePrice: number | null;
    note: string | null;
    id_ecom: number;
    category_code: string | null;
    category_name: string | null;
    is_active: boolean;
    ecom_prartner_id: number;
    prartner_name: string | null;
    barcode: string | null;
    isCheck: boolean | false;
}
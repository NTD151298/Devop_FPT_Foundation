export interface CustomerModel {
    id: number | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    count_purchases: number;
    total_price: number;
}
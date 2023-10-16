export function compareDate(start_date: Date, end_date: Date) {
    if ((!!start_date) && (!!end_date)) {
        let let_start_date: Date = new Date(start_date);
        let let_end_date: Date = new Date(end_date);

        if (let_start_date.getTime() > let_end_date.getTime()) {
            return false
        }
    }
    return true
}

export function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

export function formatLocaleDateString(date: Date) {
    return date.toLocaleDateString("vi-VN");
}

export function convertToDate(date: Date) {
    return new Date(date);
}

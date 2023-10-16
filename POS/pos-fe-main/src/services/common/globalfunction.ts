
export function validVariable(value: any) {
    if (value !== null && value !== undefined && value.toString().trim() !== "") {
        return true;
    }
    return false;
}
export function validArrayOfVar(array: Array<any>) {
    return array.every(ele => validVariable(ele));
}
export function mapArrayForDropDown(arr: any[], labelProp: string | number, valueProp: string | number) {
    return arr.map(ele => {
        return {
            value: ele[valueProp],
            label: ele[labelProp]
        }
    })
}
export function convertDateTimeToUTC(datetime: any) {
    if (!!datetime) {
        let new_date_time = new Date(JSON.parse(JSON.stringify(datetime)));
        new_date_time.setHours(15, 0, 0, 0);

        let date_time_utc = new Date(new_date_time);
        date_time_utc.setUTCHours(0, 0, 0, 0);

        return date_time_utc;
    }
    return null;
}
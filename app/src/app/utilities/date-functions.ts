export function convertDateToString(date: Date): string {
    date = new Date(date.valueOf() - date.getTimezoneOffset() * 60 * 1000);
    return date.toISOString();
}

export function convertStringToDate(dateString: string): Date {
    var date = new Date(dateString);
    if(dateString.indexOf('Z') > -1){
        date = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        console.log(date)
    }
    return date;
}
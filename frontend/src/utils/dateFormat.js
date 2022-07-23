export function dateFormat(date) {
    const day = date.split('T')[0].split('-')[2]
    const month = date.split('T')[0].split('-')[1]
    const year = date.split('T')[0].split('-')[0]
    const time = date.split('T')[1].split('.')[0]

    return 'Le ' + day + '-' + month + '-' + year + ' à ' + time
}
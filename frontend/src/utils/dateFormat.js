export function dateFormat(date) {
    const d = new Date(date)
    const formatedDate = d.toLocaleString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
        // hour: 'numeric',
        // minute: 'numeric',
        // second: 'numeric'
    })
    const formatedTime = d.toLocaleString('fr-FR', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'

    })


    return <><span className="post-header__date-date"> {formatedDate} </span> à <span className="post-header__date-time">{formatedTime}</span></>
}
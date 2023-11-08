export const timeout = (time: number) => new Promise(resolve => { setTimeout(resolve, time) })

export function getTodayDate(allDay?: boolean) {
    const todayDate = new Date()
    todayDate.setHours(23, 59, 59)
    
    let today = todayDate.getFullYear() +
        '-' +
        (todayDate.getMonth() + 1).toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) +
        '-' +
        todayDate.getDate().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + 'T' +
        todayDate.getHours().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + ':' +
        todayDate.getMinutes().toLocaleString('en-NZ', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

    return today
}

export function getLastMonthDate() {
    const todayDate = new Date()
    todayDate.setHours(23, 59, 59)

    const nextMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, todayDate.getDate())

    while (!isValidDate(nextMonth)) {
        nextMonth.setDate(nextMonth.getDate() - 1)
    }

    const formattedDate = formatDate(nextMonth)

    return formattedDate
}

function isValidDate(date: Date) {
    return !isNaN(date.getTime())
}

function formatDate(date: Date) {
    return date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0') + 'T' +
        date.getHours().toString().padStart(2, '0') + ':' +
        date.getMinutes().toString().padStart(2, '0')
}

export const setTrBg = (type, date) => {
    let bg;
    const today = new Date().toLocaleDateString()
    const targetDate = new Date(date).toLocaleDateString()
    const deadLine = new Date(today) >= new Date(targetDate)
    switch (type) {
        case "Assigned": {
            bg = 'primary'
            break;
        }
        case "Resolved": {
            bg = 'success'
            break;
        }
        case "Pending": {
            bg = 'warning'
            break;
        }
        case "In Progress": {
            bg = 'info'
            break;
        }
        default: {
            bg = ''
        }
    }
    if (!bg && deadLine) {
        return `bg-danger`
    }
    return `bg-${bg}`
}
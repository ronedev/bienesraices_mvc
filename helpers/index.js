const isSeller = (userId, propertyUserId)=>{
    return userId === propertyUserId
}

const dateFormatter = (date)=>{
    const newDate = new Date(date).toISOString().split('T')[0]

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(newDate).toLocaleDateString('es-ES', options)
}

export {
    isSeller,
    dateFormatter
}
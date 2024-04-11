const formatarData = ( data, locale='ca' ) => {
    const novaData = new Date( data ).toISOString().slice( 0, 10 )

    const opcions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    }

    return new Date( novaData ).toLocaleDateString( locale, opcions )
    
}

const formatarDataHora = ( data, locale='ca' ) => {
    const novaData = new Date( data ).toISOString().slice( 0, 16 )

    const opcions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: "numeric", 
        minute: "numeric"
    }

    return new Date( novaData ).toLocaleDateString( locale, opcions )
    
}

export {
    formatarData,
    formatarDataHora
}
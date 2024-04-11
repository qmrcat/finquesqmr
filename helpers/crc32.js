import crc32 from 'crc/crc32';

const calcCRC32 = ( clau='', stringToCrc='' ) => {
    const crc = crc32( clau + stringToCrc ).toString(16);
    return crc
}


const controlIntents = ( intentToken= '', numMaxIntents= 3 ) => {
    const clau = process.env.SAL_TOKEN_INTENTS // '2006'
    let intent = 0

    for (let i = 1; i <= numMaxIntents; i++) {
        const intenCalcToken = calcCRC32( clau, i)
        if (intenCalcToken.trim()  === intentToken.trim() ){
            return (i * 1)
        }
        intent -1
    }
    return intent
}

const returnTokenIntents = ( intent= 1 ) => {
    const clau = process.env.SAL_TOKEN_INTENTS // '2006'
    return calcCRC32( clau, intent)
}

export {
    calcCRC32,
    controlIntents,
    returnTokenIntents,

}
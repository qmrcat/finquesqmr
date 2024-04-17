import fs from 'fs'
import { join, dirname, resolve  } from 'path'
import { fileURLToPath } from 'url'
import crc32 from 'crc/crc32';
import jsonfile from 'jsonfile'

let mainTranslate = {}

let inicialitzatTranslate = false

let localeDefaultTranslate = 'en'                   // es l'idioma per defecte, si no esta la variable d'entorn (process.env.LOCALE_MAIN).
let desarMainTranslateJSON = true                   // Activa la creacio o modificació del fitxer principal.
let desarMainTranslateSaveImmediatelyJSON = true    // Activa l'opcio de desar el fitxers principal de les traduccions 
                                                    // immediatament cada vega que hi ha una nova cadena de caracters.
let createLocalesTranslateJSON = false              // Activa l'opcio de crear o modificar els fitxers de traduccions dels altres idiomes.


// Es la funcio que activa l'opcio de traduccions
const translateOpenMain = ( desarMainTranslate = true, desarMainTranslateSaveImmediately = true, 
                            createLocalesTranslate = false, localeDefault = 'en' ) => {
    
    ////console.log("🚀 ~ SOC A translateOpenMain:")
                                
    desarMainTranslateJSON = desarMainTranslate
    desarMainTranslateSaveImmediatelyJSON = desarMainTranslateSaveImmediately
    createLocalesTranslateJSON = createLocalesTranslate
    localeDefaultTranslate = localeDefault

    readFileMainTranslate()

    inicialitzatTranslate = true

}


// retorn el codi de l'idioma principal de la variable d'entron o el de la variable, localeDefaultTranslate
const getLocaleMainTranslate = () => {
    return process.env.LOCALE_MAIN || localeDefaultTranslate
}

const getLocalesTranslate = () => {
    return process.env.LOCALES
}


// retorna si estem en Producció o no, 
// si no existeis la variable d'entorn 'producction' per defecte es true
const isProduccionTranslate = () => {
    return process.env.producction
}

// retorna el directori del fitxer de traduccions
const setDirNameTranslate = () => {
    return join( resolve( dirname( fileURLToPath( import.meta.url ) ), '..' ), process.env.LOCALE_PATH )
}

// retorn la ruta completa i el nom del fitxer de l'idiona principal
const setNameFileMainTranslate = () => {
    return join( setDirNameTranslate(), process.env.LOCALE_MAIN + '.json' )
}

// retorn la ruta completa i el nom del fitxer del idioma a traduir
const setNameFileTranslate = ( locale ) => {
    return join( setDirNameTranslate(), locale + '.json' )
}


// retorn el checksum unic d'una cadena de caracters 
const getCrcStringTranslate = ( string ) => {
    return crc32( string ).toString(16);
}

// desa una matriu d'objectes, el fitxer JSON de traduccions de l'idioma principal i el desa globalment
const readFileMainTranslate = () => {
    
    console.log( 'Llegint el fitxer de traduccions original' );
    

    const file = setNameFileMainTranslate()

    let translateMain 

    try {
        translateMain = jsonfile.readFileSync(file)
        ////console.log( 'Importat el fitxer de traduccions original' );
    ////console.log("🚀 ~ readFileMainTranslate ~ translateMain:", translateMain)
    } catch (e) {
        translateMain = JSON.parse( `{"items": [ ] }` )
        ////console.log( 'El fitxer de traduccions original no existeix' );
    }

    mainTranslate = {...translateMain}
    // console.log("🚀 ~ readFileMainTranslate ~ mainTranslate:", mainTranslate)

    // console.dir('typeof: ')
    // console.dir(typeof( translateMain  ) )
    // console.dir(translateMain)

    //global.translateMain = translateMain.items;
    //console.log("🚀 ~ readFileMainTranslate ~ global.translateMain:", global.translateMain.items)




}


// Cerca un literal pel seu Id (crc-32)
const getStringMainTranslateById = ( id ) => {
    ////console.log("🚀 ~ getStringMainTranslateById ~ id:", id)
    
    // Utilitzem el mètode find() per buscar a l'array
    //return global.translateMain.find(item => item.id === id);
    ////console.log("🚀 ~ getStringMainTranslateById ~ mainTranslate:", mainTranslate)
    
    return mainTranslate.items.find(item => item.id === id);


}

//Desa un literal nou
const setNewStringMainTranslate = ( id, origial, trans ) => {

    // global.translateMain.items.push({
    //     id: id,
    //     original: origial,
    //     trans: trans
    // });

    mainTranslate.items.push( {    
        id: id,
        original: origial,
        trans: trans
    })
    ///console.log("🚀 ~ setNewStringMainTranslate ~ mainTranslate:", mainTranslate)
    if ( desarMainTranslateSaveImmediatelyJSON ){
        writeFileMainJSON()
    }

    

}


const qmrTrans = ( t ) => {
    
    ///console.log("🚀 ~ qmrTrans ~ isProduccionTranslate():", isProduccionTranslate())

    if ( !inicialitzatTranslate ) {
        translateOpenMain()
    }

    const crc = getCrcStringTranslate( t );

    const strintTranslate = getStringMainTranslateById( crc )

    ////console.log("🚀 ~ qmrTrans ~ strintTranslate:", strintTranslate)

    if (!strintTranslate) {
        ////console.log( "Soc aqui 1" );
        ////console.log( "!isProduccionTranslate" , (isProduccionTranslate() === false));

        if( process.env.producction ){
            ////console.log( "Soc aqui 2" );
            setNewStringMainTranslate( crc, t, t )
        }
        return t
    } else {
        ////console.log("🚀 ~ qmrTrans ~ strintTranslate.trans:", strintTranslate.trans)
        if( strintTranslate.trans.trim() !== '' ) {
            return strintTranslate.trans
        } else {
            return strintTranslate.original
        }
    }
    
}

const updateLocalesTranslate = ( locale, source ) => {

    console.log('Desant el fitxer de les traducions de ('+locale+').')

    const targetLocale = setNameFileTranslate(locale)

    const targetContent = fs.readFileSync(targetLocale, 'utf8');
    let target

    try {
        target = JSON.parse(targetContent);
    } catch (e) {
        target = JSON.parse( `{"items": [ ] }` )
    }

    source.items.forEach((sourceItem) => {
        const targetItem = target.items.find(item => item.id === sourceItem.id);
        if (!targetItem) {
            target.items.push(sourceItem);
        }
    });


    target.items = target.items.filter(targetItem => 
        source.items.some(sourceItem => sourceItem.id === targetItem.id)
    );


    fs.writeFileSync(targetLocale, JSON.stringify(target, null, 4), 'utf8', (error) => {
        if (error) {
            console.error('Hi ha hagut un error en escriure l\'arxiu locale: '+locale, error);
        } else {
            console.log('Arxiu locale: ' + locale +', desat correctament.');
        }
    });

    console.log('Finatlizat el proces de desar el fitxer de les traducions')

}

const writeFileMainJSON = ( solsLocales = false ) => {

    console.log('Desant el fitxer original de les traduccions')
    if ( desarMainTranslateJSON ) {
        if ( !solsLocales ) {
            fs.writeFileSync(setNameFileMainTranslate(), JSON.stringify(mainTranslate, null, 4), 'utf8', (error) => {
                if (error) {
                    console.error('Hi ha hagut un error en escriure l\'arxiu', error);
                } else {
                    console.log('Arxiu desat correctament.');
                }
            });
        }

        if( createLocalesTranslateJSON ) {
            const translateLocales = JSON.parse( getLocalesTranslate() )
            translateLocales.forEach((locale) => {
                updateLocalesTranslate( locale, mainTranslate )
                
            })
            
        }

    }
}



export {
    mainTranslate,
    inicialitzatTranslate,
    qmrTrans,
    translateOpenMain,
    setDirNameTranslate,
    setNameFileMainTranslate,
    isProduccionTranslate,
    getLocaleMainTranslate,
    writeFileMainJSON,
}
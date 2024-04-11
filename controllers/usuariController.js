import { check, validationResult } from 'express-validator'
//import Usuari from "../models/Usuari.js"
import { Usuari } from '../models/index.js'
import { generarID, generarJWT } from '../helpers/tokens.js'
import { emailRegistre, emailRecuperarPassword } from '../helpers/emails.js'
import { controlIntents, returnTokenIntents, calcCRC32 } from '../helpers/crc32.js'
import { retornIPv4Client, generarNombreAleatori, controlCodiCaptcha, genCodiControlCaptcha } from '../helpers/assets.js'
import bcrypt from 'bcrypt'
import { qmrTrans } from '../translate/translate.js'


const usuariDuplicat = async ( email ) => {
    return await Usuari.findOne( { where: { email: email } } ) ?? false
}


const formulariLogin = ( req, res ) => {


    res.render( 'auth/login', {
        __: qmrTrans,
        pagina: qmrTrans('Inici de sessió'),
        csrfToken: req.csrfToken(),
        tkintents: returnTokenIntents( 1 ),
        clientIp: retornIPv4Client(req.ip),
        init: "0",
    })

}

const accioIdentificar = async ( req, res ) => {

    let numIntent
    const numMaxIntents = 5
    const clauCodi = 'num'
    const numDigitsCodi = 3
    let cControl
    let codiUser
    let resultat

    numIntent = controlIntents( req.body._tkintents, numMaxIntents )

    if ( numIntent > numMaxIntents ) {            
        return res.render('templates/missatge', {
            __: qmrTrans,
            pagina: qmrTrans('Inici de sessió'),
            missatge: qmrTrans("S'ha superat el màxim d'intents per recuperar a inici sessió, intenteu-ho d'aquí a 20 minunts"),
            error: true
        })
    }

    await check('email').notEmpty().withMessage(qmrTrans('El correu electrònic és obligatori')).run(req)
    await check('email').isEmail().withMessage(qmrTrans('Ha de ser un correu electrònic correcte')).run(req)
    await check('password').notEmpty().withMessage(qmrTrans('La clau de pas és obligatoria')).run(req)

    resultat = validationResult( req )

    let init = req.body._init
    
    if( init === "1" ) {
        cControl = req.body._ccontrol
        codiUser = req.body.codi
    }
    
    const genCaptcha = genCodiControlCaptcha({ colorRandomFont: true, fontRandom: true })

    if( !resultat.isEmpty() ){
        init = "1"
        numIntent = controlIntents( req.body._tkintents, numMaxIntents )
        return res.render( 'auth/login', {
            __: qmrTrans,
            pagina: qmrTrans('Inici de sessió'),
            errors: resultat.array(),
            csrfToken: req.csrfToken(),
            tkintents: returnTokenIntents( (numIntent + 1) ),
            clientIp: retornIPv4Client(req.ip),
            ccontrol:  genCaptcha.ccontrol,
            pngB64Codi: genCaptcha.pngB64Codi,
            init: init,
        })
    }

    if ( init === "1" ){
        if ( !controlCodiCaptcha( cControl, codiUser, numDigitsCodi, clauCodi )  ){
        
            return res.render( '/auth/login', {
                __: qmrTrans,
                pagina: qmrTrans('Inici de sessió'),
                errors: [{msg: qmrTrans('El codi introduit no es correcte') },{msg: qmrTrans( 'Et queden pocs intents, iniciar sessió' ) }],
                csrfToken: req.csrfToken(),
                tkintents: returnTokenIntents( (numIntent + 1) ),
                clientIp: retornIPv4Client(req.ip),
                ccontrol:  genCaptcha.ccontrol,
                pngB64Codi: genCaptcha.pngB64Codi,
                init: init,
            })
        }
    }

    init = "1"

    const { email, password } = req.body

    const usuari = await Usuari.findOne( { where: { email } } )
    if( !usuari ) {
        return res.render('auth/login', {
            __: qmrTrans,
            pagina: qmrTrans('Inici de sessió'),
            errors: [{msg: qmrTrans( 'No existeix cap usuari amb aquestes dades' ) },{msg: qmrTrans( 'Et queden pocs intents, per a iniciar sessió' )}],
            csrfToken: req.csrfToken(),
            ttkintents: returnTokenIntents( (numIntent + 1) ),
            clientIp: retornIPv4Client(req.ip),
            ccontrol:  genCaptcha.ccontrol,
            pngB64Codi: genCaptcha.pngB64Codi,
            init: init,
        })
    }

    if( !usuari.confirmat ) {
        return res.render('auth/login', {
            __: qmrTrans,
            pagina: qmrTrans( 'Inici de sessió' ),
            errors: [{msg: qmrTrans( 'El teu compte no ha estat confirmat' ) },{msg: qmrTrans( 'Et queden pocs intents, per a iniciar sessió' ) }],
            csrfToken: req.csrfToken(),
            ttkintents: returnTokenIntents( (numIntent + 1) ),
            clientIp: retornIPv4Client(req.ip),
            ccontrol:  genCaptcha.ccontrol,
            pngB64Codi: genCaptcha.pngB64Codi,
            init: init,
        })
    }

    if(!usuari.verificarPassword( password )) {
        return res.render('auth/login', {
            __: qmrTrans,
            pagina: qmrTrans( 'Inici de sessió' ),
            errors: [{msg: qmrTrans( 'Existeixen errors en les dades introduïdes') },{msg: qmrTrans( 'Et queden pocs intents, per a iniciar sessió' ) }],
            csrfToken: req.csrfToken(),
            tkintents: returnTokenIntents( (numIntent + 1) ),
            clientIp: retornIPv4Client(req.ip),
            ccontrol:  genCaptcha.ccontrol,
            pngB64Codi: genCaptcha.pngB64Codi,
            init: init,
        })
    }

    console.log( "Estas identificat" );

    const tokenSessio = generarJWT( { uuid: usuari.uuid, nom: usuari.nom } )

    console.log(tokenSessio)

    return res.cookie('_tokenSss', tokenSessio, {
        httpOnly: true,
        // secure: true, // https
        // sameSite: true
    }).redirect('/propietats/llistat-propietats')

}

const formulariRegistre = ( req, res ) => {
    res.render( 'auth/registre', {
        __: qmrTrans,
        pagina: qmrTrans('Registrar-se'),
        csrfToken: req.csrfToken()
    })

}

const accioRegistre = async ( req, res ) => {
    let resultat
    let existeixUsuari = false

    await check('nom').notEmpty().withMessage( qmrTrans('El nom és obligatori') ).run(req)
    await check('email').notEmpty().withMessage( qmrTrans('El correu electrònic és obligatori') ).run(req)
    await check('email').isEmail().withMessage( qmrTrans('Ha de ser un correu electrònic correcte') ).run(req)
    await check('password').notEmpty().withMessage( qmrTrans('La clau de pas és obligatoria') ).run(req)
    await check('repetir_password').notEmpty().withMessage( qmrTrans('La segona clau de pas és obligatoria') ).run(req)
    await check('repetir_password').equals(req.body.password).withMessage( qmrTrans('Les claus de pas no són iguals') ).run(req)

    resultat = validationResult( req )
    const existeixEmail = resultat.errors.some(error => error.path === 'email');
    if( !existeixEmail ){
        existeixUsuari = await usuariDuplicat(req.body.email)
        if ( existeixUsuari ){
            await check('email').equals(req.body.email).withMessage( qmrTrans( 'Ja exiteix un usuari amb aquest correu' ) ).run(req)
            resultat.errors = [ ...resultat.errors, {
                type: 'field',
                value: req.body.email,
                msg: qmrTrans( 'Ja exiteix un usuari amb aquest correu' ),
                path: 'email',
                location: 'body'
              }]
        } 
    }

    if( !resultat.isEmpty() ){
        return res.render( 'auth/registre', {
            __: qmrTrans,
            pagina: qmrTrans( 'Registrar-se' ),
            errors: resultat.array(),
            csrfToken: req.csrfToken(),
            usuari: {
                nom: req.body.nom,
                email: req.body.email,
                password: req.body.password,
                repetir_password: req.body.repetir_password,
            }
        })
    }

    const usuari = await Usuari.create({
        nom: req.body.nom,
        email: req.body.email,
        password: req.body.password,
        token: generarID()
    })

    emailRegistre({
        nom: usuari.nom,
        email: usuari.email,
        token: usuari.token
    })

    res.render('templates/missatge', {
        __: qmrTrans,
        pagina: qmrTrans( 'Compte Creat Correctament' ),
        missatge: qmrTrans( "Hem enviat un correu a l'adreça que heu indicat, si noteu que tardeu a rebre'l, reviseu la carpeta de correu brossa." ),
        error: false
    })
}

const accioConfirmar = async ( req, res ) => {

    const { token } = req.params
    console.log( token );

    const usuari = await Usuari.findOne({ where: {token}})

    if(!usuari) {
        return res.render('auth/confirmar-compte', {
            __: qmrTrans,
            pagina: qmrTrans( 'Error en confirmar el teu compte' ),
            missatge: qmrTrans( 'Hi ha un error en confirmar el teu compte, torna a provar-ho' ),
            error: true
        })
    }

    usuari.token = null;
    usuari.confirmat = true;
    await usuari.save();

  
    res.render('auth/confirmar-compte', {
        __: qmrTrans,
        pagina: qmrTrans( 'Compte Confirmat' ),
        missatge: qmrTrans( 'El compte s\'ha confirmar correctament, Benvingut/da' ),
        error: false
    })
}


const formulariRecuperarClau = ( req, res ) => {
    
    console.log( "returnTokenIntents( 1 ): ", returnTokenIntents( 1 ) );

    const genCaptcha = genCodiControlCaptcha({ colorRandomFont: true, fontRandom: true })
    
    res.render( 'auth/recuperar-clau', {
        __: qmrTrans,
        pagina: qmrTrans( 'Recuperar clau de pas' ),
        csrfToken: req.csrfToken(),
        emailvell: '',
        tkintents: returnTokenIntents( 1 ),
        clientIp: retornIPv4Client(req.ip),
        ccontrol:  genCaptcha.ccontrol,
        pngB64Codi: genCaptcha.pngB64Codi
    })

}

const accioResetPassword = async ( req, res ) => {

    let resultat
    let existeixUsuari
    let usuari 
    let numIntent
    const numMaxIntents = 5
    const clauCodi = 'num'
    const numDigitsCodi = 3

    await check('email').notEmpty().withMessage( qmrTrans( 'El correu electrònic és obligatori' ) ).run(req)
    await check('email').isEmail().withMessage( qmrTrans( 'Ha de ser un correu electrònic correcte' ) ).run(req)
    await check('codi').notEmpty().withMessage( qmrTrans( 'El codi es obligatori' ) ).run(req)

    const cControl = req.body._ccontrol
    const codiUser = req.body.codi

    resultat = validationResult( req )

    const genCaptcha = genCodiControlCaptcha( { colorRandomFont: true, fontRandom: true } )

    if( !resultat.isEmpty() ){

        numIntent = controlIntents( req.body._tkintents, numMaxIntents )
        
        if ( numIntent < numMaxIntents ) {
            const [ n1, n2, n3 ] = generarNombreAleatori( numDigitsCodi )
            const [ num1, num2, num3 ] = [ calcCRC32( clauCodi, n1 ), calcCRC32( clauCodi, n2 ), calcCRC32( clauCodi, n3 ) ]
        
            console.log(  num1, num2, num3  );
            return res.render( 'auth/recuperar-clau', {
                __: qmrTrans,
                pagina: qmrTrans( 'Recuperar clau pas' ),
                errors: resultat.array(),
                csrfToken: req.csrfToken(),
                emailvell: req.body.email,
                tkintents: returnTokenIntents( (numIntent + 1) ),
                clientIp: retornIPv4Client(req.ip),
                ccontrol:  genCaptcha.ccontrol,
                pngB64Codi: genCaptcha.pngB64Codi
            })
        } else {
            return res.render('templates/missatge', {
                __: qmrTrans,
                pagina: qmrTrans( 'Recuperar clau de pas' ),
                missatge: qmrTrans( "S'ha superat el màxim d'intents per recuperar la clau de pas, intenteu-ho d'aquí a 20 minuts" ),
                error: true
            })
        }
    }


    if ( !controlCodiCaptcha( cControl, codiUser, numDigitsCodi, clauCodi ) ){

        numIntent = controlIntents( req.body._tkintents, numMaxIntents )
        
        if ( numIntent < numMaxIntents ) {
            return res.render( 'auth/recuperar-clau', {
                __: qmrTrans,
                pagina: qmrTrans( 'Recuperar clau pas' ),
                errors: [{msg: qmrTrans( 'El codi introduit no es correcte') },{msg: qmrTrans( 'Et queden pocs intents, per recuperar el correu' )}],
                csrfToken: req.csrfToken(),
                emailvell: req.body.email,
                tkintents: returnTokenIntents( (numIntent + 1) ),
                clientIp: retornIPv4Client(req.ip),
                ccontrol:  genCaptcha.ccontrol,
                pngB64Codi: genCaptcha.pngB64Codi
            })
        } else {
            return res.render('templates/missatge', {
                __: qmrTrans,
                pagina: qmrTrans( 'Recuperar clau de pas' ),
                missatge: qmrTrans( "S'ha superat el màxim d'intents per recuperar la clau de pas, intenteu-ho d'aquí a 20 minuts" ),
                error: true
            })
        }
    }


    usuari = await usuariDuplicat(req.body.email)

    if ( !usuari ) { // L'usuari no existeix

        numIntent = controlIntents( req.body._tkintents, numMaxIntents ) 

        if ( numIntent < numMaxIntents ) {

            return res.render('auth/recuperar-clau', {
                __: qmrTrans,
                pagina: qmrTrans( 'Recuperar clau pas' ),
                csrfToken : req.csrfToken(),
                emailvell: req.body.email, 
                errors: [{msg: qmrTrans( 'El correu electrònic no pertany a cap usuari' ) },{msg: qmrTrans( 'Et queden pocs intents, per recuperar el correu' ) }],
                tkintents: returnTokenIntents( numIntent++ ),
                clientIp: retornIPv4Client(req.ip),
                ccontrol:  genCaptcha.ccontrol,
                pngB64Codi: genCaptcha.pngB64Codi, 
            })
        } else {
            return res.render('templates/missatge', {
                __: qmrTrans,
                pagina: qmrTrans( 'Recuperar clau de pas' ),
                missatge: qmrTrans( "S'ha superat el màxim d'intents per recuperar la clau de pas, intenteu-ho d'aquí a 20 minuts" ),
                error: true
            })
        }
    } 
    
    usuari.token = generarID();
    await usuari.save();

    emailRecuperarPassword({
        email: usuari.email,
        nombre: usuari.nom,
        token: usuari.token
    })

    res.render('templates/missatge', {
        __: qmrTrans,
        pagina: qmrTrans( 'Recuperar clau de pas' ),
        missatge: qmrTrans( "Hem enviat un correu a l'adreça que heu indicat, si noteu que tardeu a rebre'l, reviseu la carpeta de correu brossa." ),
        error: false
    })

}


const accioComprobarTokenRecuperacio = async ( req, res ) => {

    const { token } = req.params;

    const usuari = await Usuari.findOne({where: {token}})
    if(!usuari) {
        return res.render('auth/confirmar-compte', {
            __: qmrTrans,
            pagina: qmrTrans( 'Reestableix el teu Password' ),
            missatge: qmrTrans( 'Hi ha un error en validar la teva informació, torna a intentar-ho' ),
            error: true
        })
    }

    if(usuari.confirmat === null) {
        return res.render('auth/confirmar-compte', {
            __: qmrTrans,
            pagina: qmrTrans( 'Reestableix el teu Password' ),
            missatge: qmrTrans( 'Aquest usuari no ha confirmat el compte, està pendent de verificar' ),
            error: true
        })   
    }

    const genCaptcha = genCodiControlCaptcha( { colorRandomFont: true, fontRandom: true } )

    res.render('auth/reset-password', {
        __: qmrTrans,
        pagina: qmrTrans( 'Reestableix el teu Password' ),
        csrfToken: req.csrfToken(),
        clientIp: retornIPv4Client(req.ip),
        ccontrol:  genCaptcha.ccontrol,
        pngB64Codi: genCaptcha.pngB64Codi,
    })

}


const accioModificarPassword = async ( req, res ) => {

    const { token } = req.params;

    const usuariControl = await Usuari.findOne({where: {token}})
    if(!usuariControl) {
        return res.render('auth/confirmar-compte', {
            __: qmrTrans,
            pagina: qmrTrans( 'Reestableix el teu Password' ),
            missatge: qmrTrans( 'Hi ha un error en validar la teva informació, torna a intentar-ho' ),
            error: true
        })
    }

    const clauCodi = 'num'
    const numDigitsCodi = 3

    await check('password').notEmpty().withMessage( qmrTrans( 'La clau de pas és obligatoria' ) ).run(req)
    await check('repetir_password').notEmpty().withMessage( qmrTrans( 'La segona clau de pas és obligatoria' ) ).run(req)
    await check('repetir_password').equals(req.body.password).withMessage( qmrTrans( 'Les claus de pas no són iguals' ) ).run(req)
    await check('codi').notEmpty().withMessage( qmrTrans( 'El codi es obligatori' ) ).run(req)

    let resultat = validationResult( req )

    const cControl = req.body._ccontrol
    const codiUser = req.body.codi

    if ( !controlCodiCaptcha( cControl, codiUser, numDigitsCodi, clauCodi ) &&  req.body.codi !== ''){

        resultat.errors = [ ...resultat.errors, {
            type: 'field',
            value: req.body.codi,
            msg: qmrTrans( 'El codi introduit no es correcte' ),
            path: 'codi',
            location: 'body'
          }]

    }

    if(!resultat.isEmpty()) {
        const genCaptcha = genCodiControlCaptcha( { colorRandomFont: true, fontRandom: true } )

        return res.render('auth/reset-password', {
            __: qmrTrans,
            pagina: qmrTrans( 'Reestableix el teu Password' ),
            csrfToken : req.csrfToken(),
            errores: resultat.array(),
            clientIp: retornIPv4Client(req.ip),
            ccontrol:  genCaptcha.ccontrol,
            pngB64Codi: genCaptcha.pngB64Codi,
        })
    }

    const { password } = req.body;

    const usuari = await Usuari.findOne({where: {token}})

    const salt = await bcrypt.genSalt(10)
    usuari.password = await bcrypt.hash( password, salt);
    usuari.token = null;

    await usuari.save();

    return res.render('auth/confirmar-compte', {
        __: qmrTrans,
        pagina: qmrTrans( 'Reestableix el teu Password' ),
        missatge: qmrTrans( 'La Paraula de pas s\'ha desat correctament' ),
        error: false
    })
}

const accioTancarSessio = async ( req, res ) => {

    return res.clearCookie('_tokenSss').status(200).redirect('/home')
}

export {
    formulariLogin,
    accioIdentificar,
    formulariRegistre,
    accioRegistre,
    accioConfirmar,
    formulariRecuperarClau,
    accioResetPassword,
    accioComprobarTokenRecuperacio,
    accioModificarPassword,
    accioTancarSessio
}
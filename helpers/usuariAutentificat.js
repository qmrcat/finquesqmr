import jwt from 'jsonwebtoken'
import { Usuari } from '../models/index.js'

const usuariAutentificat = async ( req ) => {
    let userOk
    const { _tokenSss } = req.cookies

    try {
        if(!_tokenSss) {
            userOk = false
        } else {
            const decoded = jwt.verify(_tokenSss, process.env.JWT_SECRET)
            const usuari = await Usuari.scope('eliminarPassword').findOne({ where: { uuid: decoded.uuid } });
            userOk = (usuari) ? true : false
        }       
    } catch (error) {
        userOk = false        
    } 

    return userOk;
      
}

const returnUsuariAutentificat = async ( req ) => {
    let usuari = null
    const { _tokenSss } = req.cookies

    try {
        if(_tokenSss) {
            const decoded = jwt.verify(_tokenSss, process.env.JWT_SECRET)
            usuari = await Usuari.scope('eliminarPassword').findOne({ raw: true, where: { uuid: decoded.uuid } });
        }       
    } catch (error) {
    } 

    return usuari;
      
}

const returnUsuariAutentificatPerToken = async ( token ) => {
    
    console.log("🚀 ~ returnUsuariAutentificatPerToken ~ returnUsuariAutentificatPerToken:")
    
    let usuari = null
    //const { _tokenSss } = req.cookies

    try {
        if( token ) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            usuari = await Usuari.scope('eliminarPassword').findOne({ raw: true, where: { uuid: decoded.uuid } });
        }       
    } catch (error) {
    } 

    return usuari;
      
}

export { 
    usuariAutentificat,
    returnUsuariAutentificat,
    returnUsuariAutentificatPerToken
}
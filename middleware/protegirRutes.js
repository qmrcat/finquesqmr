import jwt from 'jsonwebtoken'
import { Usuari } from '../models/index.js'
import { returnUsuariAutentificat } from '../helpers/usuariAutentificat.js'

const protegirRutes = async (req, res, next) => {
    ////console.log( 'Soc a protegirRutes --' );

    const { _tokenSss } = req.cookies
    console.log("🚀 ~ protegirRutes ~ req.cookies:", req.cookies)
    
    if(!_tokenSss) {
        ////console.log( 'Soc a protegirRutes -- no existeix _tokenSss' );
        return res.redirect('/auth/login')
    }

    ////console.log( 'Soc a protegirRutes -- // Comprobar el Token' );

    try {
        const decoded = jwt.verify(_tokenSss, process.env.JWT_SECRET)
        const usuari = await Usuari.scope('eliminarPassword').findOne({ where: { uuid: decoded.uuid } });

        if(usuari) {
            req.usuari = usuari
        }  else {
            return res.redirect('/home')
        }
        return next();
        
    } catch (error) {
        console.log("Error: protegirRutes:", error)
        return res.clearCookie('_tokenSss').redirect('home')
    } 

}

const userXatOk = async ( galetaToken ) => {

    let userOk

    try {
        if( !galetaToken ) {
            userOk = false
        } else {
            const decoded = jwt.verify(galetaToken, process.env.JWT_SECRET)
            const usuari = await Usuari.scope('eliminarPassword').findOne({ where: { uuid: decoded.uuid } });
            userOk = (usuari) ? true : false
        }       
    } catch (error) {
        console.log("Error: userOkXat:", error)
        userOk = false        
    } 
    return userOk

    
}

const usuariOK = async (req, res, next) => {
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
        console.log("Error: usuariOK:", error)
        userOk = false        
    } 
    req.usuariOk = userOk

    return next();
}


export {
    protegirRutes,
    usuariOK,
    userXatOk,
}

//export default protegirRutes
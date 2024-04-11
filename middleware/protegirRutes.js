import jwt from 'jsonwebtoken'
import { Usuari } from '../models/index.js'

const protegirRutes = async (req, res, next) => {
    console.log( 'Soc a protegirRutes --' );

    const { _tokenSss } = req.cookies
    console.log("🚀 ~ protegirRutes ~ req.cookies:", req.cookies)
    
    if(!_tokenSss) {
        console.log( 'Soc a protegirRutes -- no existeix _tokenSss' );
        return res.redirect('/auth/login')
    }

    console.log( 'Soc a protegirRutes -- // Comprobar el Token' );

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
        return res.clearCookie('_tokenSss').redirect('home')
    } 

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
        console.log("🚀 ~ protegirRutes.js  usuariOK: ~ error:", error)
        userOk = false        
    } 
    req.usuariOk = userOk

    return next();
}


export {
    protegirRutes,
    usuariOK,
}

//export default protegirRutes
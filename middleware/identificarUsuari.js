import jwt from 'jsonwebtoken'
import Usuari from '../models/Usuari.js'

const identificarUsuari = async (req, res, next) => {
    const {_tokenSss} = req.cookies
    if(!_tokenSss) {
        req.usuari = null
        return next()
    }

    try {
        const decoded = jwt.verify(_tokenSss, process.env.JWT_SECRET)
        const usuari = await Usuari.scope('eliminarPassword').findByPk(decoded.id)
        
        if(usuari) {
            req.usuario = usuari
        }
        return next();
    } catch (error) {
        console.log(error) 
        return res.clearCookie('_tokenSss').redirect('/auth/login')
    }
}

export default identificarUsuari
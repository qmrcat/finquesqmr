import jwt from 'jsonwebtoken'

const generarJWT = dades => jwt.sign(
    { 
        uuid: dades.uuid, 
    }, 
    process.env.JWT_SECRET, 
    { 
        expiresIn: '1d' 
    }
)

const generarID = () => Math.random().toString(32).substring(2) + Date.now().toString(32)

export {
    generarID,
    generarJWT
}
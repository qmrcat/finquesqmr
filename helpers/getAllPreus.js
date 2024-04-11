import { Preu } from '../models/index.js'

const getReturnAllPreus = async () => {
    const [preus] = await Promise.all([
        Preu.findAll({raw: true})
    ])
    return preus
}


export {
    getReturnAllPreus
}
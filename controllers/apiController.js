import { Propietat, Preu, Categoria } from '../models/index.js'

const propietatsJSON = async (req, res) => {

    const propietats = await Propietat.findAll({
        where: { publicat: true },
        include: [
            {model: Preu, as: 'preu'},
            {model: Categoria, as: 'categoria'},
        ]
    })

    res.json( propietats )
}

export {
    propietatsJSON
}
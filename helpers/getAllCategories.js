import { Categoria } from '../models/index.js'

const getReturnAllCategories = async () => {

    const [categories] = await Promise.all([
        Categoria.findAll({raw: true}),
    ])

    return categories
}

export {
    getReturnAllCategories

}
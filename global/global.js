import { getReturnAllCategories } from "../helpers/getAllCategories.js"
import { getReturnAllPreus } from "../helpers/getAllPreus.js"

let inicialitzatGlobal = false

const globalApp = async () => {

    inicialitzatGlobal = true

}


const isInitializedGlobal = () => {
    if ( !inicialitzatGlobal ) {
        globalApp()
    }
}


const getAllCategoriesGlobal = async () => {
    isInitializedGlobal()
    return await getReturnAllCategories()
}


const getAllPreusGlobal = async () => {
    isInitializedGlobal()
    return await getReturnAllPreus()
}


export {
    globalApp,
    getAllCategoriesGlobal,
    getAllPreusGlobal

}
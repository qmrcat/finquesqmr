import { exit } from 'node:process'
import categories from './categories.js'
import preus from './preus.js'
import usuaris from './usuaris.js'
import db from '../config/db.js'
import { Categoria, Preu, Usuari } from '../models/index.js'

const importarDatos = async () => {
    try {
        await db.authenticate()
        await db.sync()
        await Promise.all([
            Categoria.bulkCreate(categories),
            Preu.bulkCreate(preus),
            Usuari.bulkCreate(usuaris)
        ])

        console.log('Dades Importades Correctament')
        exit()
        
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({force: true})
        console.log('Dades Eliminades Correctament');
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}

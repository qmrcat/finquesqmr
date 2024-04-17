import { join, dirname, resolve  } from 'path'
import { fileURLToPath } from 'url'
import Sequelize from "sequelize"
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

let db;

////console.log( 'process.env.BD_TYPE_DATABASE ', process.env.BD_TYPE_DATABASE );

if (process.env.BD_TYPE_DATABASE === 'sqlite'){
    
    const storage = join( resolve( dirname( fileURLToPath( import.meta.url ) ), '..' ), process.env.BD_STORATGE,  process.env.BD_NOM ) + '.' + process.env.BD_DIALECT
    try {
        db = new Sequelize({
            dialect: process.env.BD_DIALECT,
            storage: storage,
            define: {
                timestamp: true
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            operatorAliases: false,
            logging: false,
        })

    } catch (error) {
        console.log(error)
    }
} else {

    db = new Sequelize(process.env.BD_NOM, process.env.BD_USER, process.env.BD_PASS, {
        host: process.env.BD_HOST,
        port: process.env.BD_PORT,
        dialect: process.env.BD_DIALECT,
        define: {
            timestamp: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorAliases: false,
        logging: false
    })
}

export default db
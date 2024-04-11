import { DataTypes } from "sequelize"
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Usuari = db.define('usuaris', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    token: DataTypes.STRING,
    confirmat: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
}, {
    hooks: {
        beforeCreate: async function(usuari) {
            const salt = await bcrypt.genSalt(10)
            usuari.password = await bcrypt.hash( usuari.password, salt);
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmat', 'createdAt', 'updatedAt']
            }
        }
    }
})

// Métodos Personalizados
Usuari.prototype.verificarPassword = function( password ) {
    return bcrypt.compareSync( password, this.password );
}

export default Usuari

import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Categoria = db.define('categories', {
    nom: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nomplu: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

export default Categoria
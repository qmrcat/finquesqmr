import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Preu = db.define('preus', {
    nom: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

export default Preu
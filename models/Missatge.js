import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Missatge = db.define('missatges', {
    missatge: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    llegit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});

export default Missatge
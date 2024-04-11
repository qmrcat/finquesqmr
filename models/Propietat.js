import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Propietat = db.define('propietats', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titol: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcio: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    habitacions: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estacionament: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carrer: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imatge: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    missatges: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }    
});

export default Propietat;
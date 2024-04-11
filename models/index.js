import Propietat from './Propietat.js'
import Preu from './Preu.js'
import Categoria from './Categoria.js'
import Usuari from './Usuari.js'
import Missatge from './Missatge.js'

Propietat.belongsTo(Preu, { as: 'preu',  foreignKey: 'preuId'})
Propietat.belongsTo(Categoria, { as: 'categoria',  foreignKey: 'categoriaId'})
Propietat.belongsTo(Usuari, { as: 'usuari',  foreignKey: 'usuariId'})
Propietat.hasMany(Missatge, { as: 'missatge', foreignKey: 'propietatId'} )

Missatge.belongsTo(Propietat, { as: 'propietat',  foreignKey: 'propietatId'})
Missatge.belongsTo(Usuari, { as: 'usuariEmissor', foreignKey: 'usuariEmissorId'})
Missatge.belongsTo(Usuari, { as: 'usuariDesti', foreignKey: 'usuariDestiId'})

export {
    Propietat,
    Preu,
    Categoria,
    Usuari, 
    Missatge
}
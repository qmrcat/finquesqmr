import { Sequelize } from 'sequelize'
import { validationResult } from 'express-validator'
import { Preu, Categoria, Propietat } from '../models/index.js'
import { qmrTrans } from '../translate/translate.js'
import { usuariAutentificat } from '../helpers/usuariAutentificat.js'

const webHome = async ( req, res ) => {

    //console.log( "soc a HOME " );
    //const categories = await Categoria.findAll()
    
    // const [categories, preus] = await Promise.all([
    //     Categoria.findAll(),
    //     Preu.findAll()
    // ])

    const [ propietats ] = await Promise.all([
        Propietat.findAll({
            limit: 3,
            include: [
                {
                    model: Preu, 
                    as: 'preu'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        }),
    ])
   
    res.render('home/home-public', {
        __: qmrTrans,
        pagina: qmrTrans('Cerca la teva casa de somni'),
        csrfToken: req.csrfToken(),
        categories: global.allCategories,
        preus: global.allPreus,
        usuariAutentificat: await usuariAutentificat( req ),
        propietatsUltimes: propietats
    })

}

const webCategories = async ( req, res ) => {
    console
    .log("🚀 ~ SOC A ---> webCategories ~ webCategories:")

    const { id } = req.params

    // Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }

    // Obtener las propiedades de la categoria
    const propietats = await Propietat.findAll({
        where: {
            categoriaId: id
        }, 
        include: [
            { model: Preu, as: 'preu'}
        ]
    })

    res.render('categoria', {
        __: qmrTrans,
        pagina: `${categoria.nomplu} ${qmrTrans('en Venda')}`,
        propietats,
        csrfToken: req.csrfToken(),
        usuariAutentificat: await usuariAutentificat( req ),
        categories: global.allCategories,
        preus: global.allPreus,
    })
}

const webCercador = async ( req, res ) => {


    const { consulta } = req.body

    // Validar que termino no este vacio
    if(! consulta.trim()) {
        return res.redirect('back')
    }

    // Consultar las propiedades
    const propietats = await Propietat.findAll({
        where: {
            titol: {
                [Sequelize.Op.like] : '%' +  consulta + '%'
            }
        },
        include: [
            { model: Preu, as: 'preu'}
        ]
    })

    res.render('cercar', {
        __: qmrTrans,
        pagina: qmrTrans('Resultats de la Cerca'),
        propietats, 
        csrfToken: req.csrfToken(),
        usuariAutentificat: await usuariAutentificat( req ),
        categories: global.allCategories,
        preus: global.allPreus,
    })

}


const web404 = async ( req, res ) => {
    res.render('404', {
        __: qmrTrans,
        pagina: qmrTrans('Error, pagina no trobada'),
        csrfToken: req.csrfToken(),
        usuariAutentificat: await usuariAutentificat( req ),
        categories: global.allCategories,
        preus: global.allPreus,
    })
}


export {
    webHome,
    webCategories,
    webCercador,
    web404,
}
import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Preu, Categoria, Propietat, Usuari, Missatge } from '../models/index.js'
import { qmrTrans } from '../translate/translate.js'
import { esVenedor } from '../helpers/esVenedor.js'
import { usuariAutentificat, returnUsuariAutentificat } from '../helpers/usuariAutentificat.js'
import { formatarData, formatarDataHora } from '../helpers/formatarData.js'

const __old__formulariAdmin = ( req, res ) => {
   
    res.render('propietats/admin', {
        __: qmrTrans,
        pagina: qmrTrans('Llistat propietats'),
        csrfToken: req.csrfToken(),
        barraMenu: true,
    })

}

const formulariAdmin = async (req, res) => {

    const { pagina: paginaActual } = req.query
    
    const expresion = /^[1-9][0-9]*$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/propietats/llistat-propietats?pagina=1')
    }

    try {
        const {id} = req.usuari
        const limit = 6 // 10
        const offset = ((paginaActual * limit) - limit)

        const [propietats, total] = await Promise.all([
            Propietat.findAll({
                limit,
                offset,
                where: {
                    usuariId : id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Preu, as: 'preu' },
                ],
            }),
            Propietat.count({
                where: {
                    usuariId : id
                }
            }) 
        ])

        res.render('propietats/admin', {
            __: qmrTrans,
            pagina: qmrTrans('Llistat propietats'),
            propietats,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit,
            usuariAutentificat: usuariAutentificat( req ),
            translateJs: `    
            const cadenaTranslate = {
                cadena01: "${qmrTrans('No s\'ha pogut canviar l\'estat')}",
                cadena02: "${qmrTrans('Publicat')}",
                cadena03: "${qmrTrans('Pendent de publicar')}"
            }`
        })

    } catch (error) {
        console.log(error)
        return res.render('templates/missatge', {
            __: qmrTrans,
            pagina: qmrTrans('Error base de dades'),
            missatge: qmrTrans("S'ha produit un error: ") + error ,
            error: true
        })
    }
    
}

const formulariAltaPropietat = async ( req, res ) => {
    
    res.render('propietats/crear', {
        __: qmrTrans,
        pagina: qmrTrans('Alta propietat'),
        csrfToken: req.csrfToken(),
        barraMenu: true,
        categories: global.allCategories,
        preus: global.allPreus,
        dades: {}
    })

}

const accioCanviarEstat = async ( req, res ) => {

    const {id} = req.params

    const propietat = await Propietat.findByPk(id)

    let resultat = true
    let missatge = ''

    console.log("🚀 ~ accioCanviarEstat ~ req.usuari:", req.usuari)

        if(!propietat) {
            resultat = false
            missatge = qmrTrans('No existeix la propietat')
        }

        if(propietat.usuariId.toString() !== req.usuari.id.toString() ) {
            resultat = false
            missatge = qmrTrans('Aquesta propietat no es pot modificar') + ', ' + qmrTrans('no tens permisos')
        }


    if (resultat) {
        propietat.publicat = !propietat.publicat

        await propietat.save()
        missatge = qmrTrans("S'ha modificat l'estat correctament")
    }

    res.json({
        resultat: resultat,
        missatge: missatge
    })

}

const formulariEditarPropietat = async ( req, res ) => {

    const { id } = req.params

    const propietat = await Propietat.findByPk(id)

    if(!propietat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if(propietat.usuariId.toString() !== req.usuari.id.toString() ) {
        return res.redirect('/propietats/llistat-propietats')
    }

    res.render('propietats/editar', {
        __: qmrTrans,
        pagina: qmrTrans('Modificar propietat'),
        csrfToken: req.csrfToken(),
        barraMenu: true,
        categories: global.allCategories,
        preus: global.allPreus,
        dades: propietat
    })

}

const accioDesarCanvisPropietat = async ( req, res ) => {

    let resultat = validationResult( req )
    console.log("🚀 ~ accioDesarCanvisPropietat ~ resultat:", resultat)
    
    if ( !resultat.isEmpty() ) {
        return res.render('propietats/editar', {
            __: qmrTrans,
            pagina: qmrTrans('Modificar propietat'),
            csrfToken: req.csrfToken(),
            barraMenu: true,
            categories: global.allCategories,
            preus: global.allPreus,
            errors: resultat.array(),
            dades: req.body,
        })
    }


    const { id } = req.params

    const propietat = await Propietat.findByPk(id)

    if(!propietat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if(propietat.usuariId.toString() !== req.usuari.id.toString() ) {
        return res.redirect('/propietats/llistat-propietats')
    }

    try {

        const { titol, descripcio, habitacions, estacionament, wc, carrer, lat, lng, preu: preuId, categoria: categoriaId } = req.body

        propietat.set({
            titol,
            descripcio,
            habitacions, 
            estacionament, 
            wc,
            carrer,
            lat,
            lng,
            preuId,
            categoriaId,
        })
        
        await propietat.save();

        res.redirect('/propietats/llistat-propietats')
        
    } catch (error) {
        console.log(error)
    }

}

const accioDesarPropietat = async ( req, res ) => {

    let resultat = validationResult( req )

    if ( !resultat.isEmpty() ) {
        return res.render('propietats/crear', {
            __: qmrTrans,
            pagina: qmrTrans('Alta propietat'),
            csrfToken: req.csrfToken(),
            barraMenu: true,
            categories: global.allCategories,
            preus: global.allPreus,
            dades: req.body,
            errors: resultat.array(),
        })
    }

    // Crear un Registro

    const { titol, descripcio, habitacions, estacionament, wc, carrer, lat, lng, preu: preuId, categoria: categoriaId } = req.body

    const { id: usuariId } = req.usuari
  
    try {
        const propietatDesada = await Propietat.create({
            titol,
            descripcio,
            habitacions, 
            estacionament, 
            wc,
            carrer,
            lat,
            lng,
            preuId,
            categoriaId,
            usuariId,
            imatge: ''
        })

        const { id } = propietatDesada

        res.redirect(`/propietats/afegir-imatge/${id}`)

    } catch (error) {
        console.log(error)
    }

}


const accioEliminarPropietat = async (req, res) => {
    
    const {id} = req.params

    const propietat = await Propietat.findByPk(id)
    if(!propietat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if(propietat.usuariId.toString() !== req.usuari.id.toString() ) {
        return res.redirect('/propietats/llistat-propietats')
    }

    await unlink(`public/uploads/${propietat.imatge}`)
    console.log(`S'ha eliminat la imatge ${propietat.imatge}`)

    await propietat.destroy()
    res.redirect('/propietats/llistat-propietats')

}


const afegirImatge = async ( req, res ) => {

    const {id} = req.params

    const propietat = await Propietat.findByPk(id)

    if(!propietat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if(propietat.publicat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if( req.usuari.id.toString() !== propietat.usuariId.toString() ) {
        return res.redirect('/propietats/llistat-propietats')
    }

    res.render('propietats/afegir-imatge', {
        __: qmrTrans,
        pagina: qmrTrans("Afegir Imatge:") + ' ' + `${propietat.titol}`,
        csrfToken: req.csrfToken(),
        propietat
    })

}

const desarImatge = async ( req, res ) => {

    const {id} = req.params

    const propietat = await Propietat.findByPk(id)
    if(!propietat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if(propietat.publicat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if( req.usuari.id.toString() !== propietat.usuariId.toString() ) {
        return res.redirect('/propietats/llistat-propietats')
    }

    try {
        propietat.imatge = req.file.filename
        propietat.publicat = 1

        await propietat.save()
        return res.redirect('/propietats/llistat-propietats')

    } catch (error) {
        return res.redirect('/propietats/llistat-propietats')
    }

}

const redirectHome = ( req, res ) => {
    if(req.usuariOk){
        res.redirect('/propietats/llistat-propietats')
    } else { 
        res.redirect('/home')
    }
}


const visualtzarPropietat = async ( req, res ) => {
    try {
        
        const {id} = req.params
        
        const propietat = await Propietat.findByPk(id, {
            include : [
                { model: Preu, as: 'preu' },
                { model: Categoria, as: 'categoria', scope: 'eliminarPassword' },
            ]
        })

        if(!propietat || !propietat.publicat) {
            return res.redirect('/404')
        }

        const usuari = await returnUsuariAutentificat( req )

        res.render('propietats/visualitzar', {
            __: qmrTrans,
            propietat,
            pagina: propietat.titol,
            csrfToken: req.csrfToken(),
            usuari: await returnUsuariAutentificat( req ),
            esVenedor: esVenedor(usuari?.id, propietat.usuariId ),
            usuariAutentificat: await usuariAutentificat( req ),
            categories: global.allCategories,
            preus: global.allPreus,
            errors: {},
        })

    } catch (error) {

        console.log(error)
        return res.render('templates/missatge', {
            __: qmrTrans,
            pagina: qmrTrans('Error base de dades'),
            missatge: qmrTrans("S'ha produit un error: ") + error ,
            error: true
        })

    }   


}


const enviarMissatge = async ( req, res ) => {
    const { id } = req.params

    const propietat = await Propietat.findByPk(id, {
        include : [
            { model: Preu, as: 'preu' },
            { model: Categoria, as: 'categoria' },
        ]
    })

    if(!propietat) {
        return res.redirect('/404')
    }

    let resultat = validationResult(req)

    const usuari = await returnUsuariAutentificat( req )

    if(!resultat.isEmpty()) {

        const propietat = await Propietat.findByPk(id, {
            include : [
                { model: Preu, as: 'preu' },
                { model: Categoria, as: 'categoria' },
            ]
        })

        if(!propietat || !propietat.publicat) {
            return res.redirect('/404')
        }

        return res.render('propietats/visualitzar', {
            __: qmrTrans,
            propietat,
            pagina: propietat.titol,
            csrfToken: req.csrfToken(),
            usuari: await returnUsuariAutentificat( req ),
            esVenedor: esVenedor(usuari?.id, propietat.usuariId ),
            usuariAutentificat: await usuariAutentificat( req ),
            categories: global.allCategories,
            preus: global.allPreus,
            errors: resultat.array(),
        })
    }

    try {
        const { missatge } = req.body
        const { id: propietatId } = req.params
        const usuariEmissorId  = usuari.id
        const usuariDestiId = propietat.usuariId

        await Missatge.create({
            missatge,
            propietatId,
            usuariEmissorId,
            usuariDestiId
        })

        propietat.set({
            missatges: 1
        })
        
        await propietat.save();

    } catch (error) {
        console.log(error)
        return res.render('templates/missatge', {
            __: qmrTrans,
            pagina: qmrTrans('Error base de dades'),
            missatge: qmrTrans("S'ha produit un error: ") + error ,
            error: true
        })
    }

    res.redirect('/')

}


const visualitzarMissatges = async (req, res) => {

    const {id} = req.params

    const [propietat, missatges] = await Promise.all([
        Propietat.findByPk(id, {
            raw: true,
        }),
        Missatge.findAll({
            raw: true,
            where: {
              propietatId: id
            }, 
            include : [
                { model: Usuari, as: 'usuariEmissor', attributes: {
                    exclude: ['password', 'token', 'confirmat', 'createdAt', 'updatedAt', 'uuid', 'admin', 'id']
                }, },
            ]
        })
    ])

    if(!propietat) {
        return res.redirect('/propietats/llistat-propietats')
    }

    if(propietat.usuariId.toString() !== req.usuari.id.toString() ) {
        return res.redirect('/propietats/llistat-propietats')
    }
    res.render('propietats/missatges', {
        __: qmrTrans,
        pagina: 'Missatges de la propitat: ' + propietat.titol,
        missatges: missatges,
        formatarData,
        formatarDataHora
    })
}


const perfil = async ( req, res ) => {

    try {
        const {id} = req.usuari

        const usuari = await returnUsuariAutentificat( req )
        
        res.render('propietats/perfil', {
            __: qmrTrans,
            pagina: qmrTrans('Perfil'),
            csrfToken: req.csrfToken(),
            usuari: usuari,
            usuariAutentificat: await usuariAutentificat( req ),
            categories: global.allCategories,
            preus: global.allPreus,
        })
        
    } catch {

        console.log(error)
        return res.render('templates/missatge', {
            __: qmrTrans,
            pagina: qmrTrans('Error base de dades'),
            missatge: qmrTrans("S'ha produit un error: ") + error ,
            error: true
        })

    }


}

export {
    formulariAdmin,
    formulariAltaPropietat,
    formulariEditarPropietat,
    accioDesarPropietat,
    accioDesarCanvisPropietat,
    accioEliminarPropietat,
    afegirImatge,
    desarImatge,
    redirectHome,
    visualtzarPropietat,
    perfil,
    enviarMissatge,
    visualitzarMissatges,
    accioCanviarEstat
}
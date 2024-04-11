import express from "express"
import { body } from 'express-validator'
import { formulariAdmin, formulariAltaPropietat, formulariEditarPropietat, accioDesarPropietat, 
            accioEliminarPropietat, accioDesarCanvisPropietat, afegirImatge, desarImatge, redirectHome, 
                visualtzarPropietat, perfil, enviarMissatge, visualitzarMissatges, accioCanviarEstat } from '../controllers/propietatsController.js'
import upload from '../middleware/pujarImagte.js'
import { protegirRutes, usuariOK } from "../middleware/protegirRutes.js"
import identificarUsuari  from "../middleware/identificarUsuari.js"

const router = express.Router()


router.get('/propietat/:id', 
    identificarUsuari,
    visualtzarPropietat
)

router.post('/propietat/:id', 
    protegirRutes,
    
    body( 'missatge' ).isLength( { min: 20 } ).withMessage('El Missatge no pot anar buit o és molt curt'),
    body( 'missatge' ).isLength( { max: 200 } ).withMessage( 'El missatge és molt llarg, max. 200 caracters' ),

    enviarMissatge
)

router.put('/propietat/:id', 
    protegirRutes,
    accioCanviarEstat
)

router.get('/propietats/llistat-propietats', protegirRutes, formulariAdmin )
router.get('/llistat-propietats', protegirRutes, formulariAdmin )

router.get('/propietats/crear', protegirRutes, formulariAltaPropietat )

router.post('/propietats/crear', 
    protegirRutes,
    body( 'titol' ).notEmpty().withMessage( 'El titol de l\'anunci es obligatori' ),
    body( 'descripcio' )
        .notEmpty().withMessage( 'La descripció no pot anar buida' )
        .isLength( { max: 200 } ).withMessage( 'La descripció és molt llarga' ),
    body( 'categoria' ).isNumeric().withMessage( 'Selecciona una categoria' ),
    body( 'preu' ).isNumeric().withMessage( 'Selecciona un rang de preus' ),
    body( 'habitacions' ).isNumeric().withMessage( 'Selecciona la quantitat d\'habitacions' ),
    body( 'estacionament' ).isNumeric().withMessage( 'Selecciona la quantitat d\'estacionaments' ),
    body( 'wc' ).isNumeric().withMessage( 'Selecciona la quantitat de banys' ),
    body( 'lat' ).notEmpty().withMessage( 'Ubica la propietat al mapa' ),
    accioDesarPropietat  
)

router.get('/propietats/perfil', 
    protegirRutes,
    perfil
)


router.get('/propietats/afegir-imatge/:id', 
    protegirRutes,
    afegirImatge
)

router.post('/propietats/afegir-imatge/:id',
    protegirRutes,
    upload.single('imatge'),
    desarImatge
)

router.get('/propietats/editar/:id', 
    protegirRutes,
    formulariEditarPropietat
)

router.post('/propietats/editar/:id', 
    protegirRutes,
    body( 'titol' ).notEmpty().withMessage( 'El titol de l\'anunci es obligatori' ),
    body( 'descripcio' )
        .notEmpty().withMessage( 'La descripció no pot anar buida' )
        .isLength( { max: 200 } ).withMessage( 'La descripció és molt llarga' ),
    body( 'categoria' ).isNumeric().withMessage( 'Selecciona una categoria' ),
    body( 'preu' ).isNumeric().withMessage( 'Selecciona un rang de preus' ),
    body( 'habitacions' ).isNumeric().withMessage( 'Selecciona la quantitat d\'habitacions' ),
    body( 'estacionament' ).isNumeric().withMessage( 'Selecciona la quantitat d\'estacionaments' ),
    body( 'wc' ).isNumeric().withMessage( 'Selecciona la quantitat de banys' ),
    body( 'lat' ).notEmpty().withMessage( 'Ubica la propietat al mapa' ),
    accioDesarCanvisPropietat  
)

router.post('/propietats/eliminar/:id', 
    protegirRutes,
    accioEliminarPropietat 
)

router.get('/propietats/missatges/:id', 
    protegirRutes,
    visualitzarMissatges
)

router.get('*', 
    usuariOK,
    redirectHome
)

export default router
import express from "express"
import { 
    formulariLogin, 
    accioIdentificar,
    formulariRegistre, 
    accioRegistre, 
    accioConfirmar, 
    formulariRecuperarClau, 
    accioResetPassword,
    accioComprobarTokenRecuperacio,
    accioModificarPassword,
    accioTancarSessio
} from "../controllers/usuariController.js";

const router = express.Router();

router.get('/login', formulariLogin )
router.post('/login', accioIdentificar);

router.get('/registre', formulariRegistre )
router.post('/registre', accioRegistre )
router.get('/confirmar/:token', accioConfirmar )

router.get('/recuperar', formulariRecuperarClau )
router.post('/recuperar', accioResetPassword )

router.get('/recuperar-pas/:token', accioComprobarTokenRecuperacio )
router.post('/recuperar-pas/:token', accioModificarPassword )

router.get('/tancar-sessio', accioTancarSessio )
router.post('/tancar-sessio', accioTancarSessio )

router.get('*', (req, res) => {
    res.send('Error 404 auth')
})

export default router
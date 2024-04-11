import express from "express"
import { body } from 'express-validator'
import { webHome, webCategories, webCercador, web404, } from '../controllers/appController.js'
import { visualtzarPropietat } from '../controllers/propietatsController.js'

const router = express.Router()

router.get('/home', webHome )
router.get('/', webHome )
router.get('/categories/:id', webCategories )
router.get('/propietat/:id', visualtzarPropietat )

router.post('/cercar', webCercador)

router.get('/404', web404)

router.get('*', web404 )

export default router
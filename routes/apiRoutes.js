import express from 'express'
import { propietatsJSON } from '../controllers/apiController.js'

const router = express.Router()


router.get('/propietats', propietatsJSON)


export default router
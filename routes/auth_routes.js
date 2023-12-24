import express from 'express'
import {Login_Via_Google,Register_New_User,Login_User} from '../controllers/user_auth/auth_controller.js'

const app = express()
const router = express.Router()

app.use(express.urlencoded({ extended: false }));

router.post('/signup',Register_New_User)
router.post('/login',Login_User)
router.post('/google/login',Login_Via_Google)
export default router
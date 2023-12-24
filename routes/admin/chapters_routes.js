import { Chapters_By_Act,Add_Chapter,Update_Chapter } from "../../controllers/admin/chapters_controller.js";
import express from 'express'
import { verifyToken } from "../../middleware/verify.mjs";
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));


router.get('/chapters/list',verifyToken,Chapters_By_Act)
router.post('/chapter/new',verifyToken,Add_Chapter)
router.put('/chapter/update/:id',verifyToken,Update_Chapter)

export default router
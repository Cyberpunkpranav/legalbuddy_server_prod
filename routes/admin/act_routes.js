import { Add_Act,Update_Act,Acts_list, Act_by_Id} from "../../controllers/admin/acts_controller.js"
import express from 'express'
import { verifyToken } from "../../middleware/verify.mjs"
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));

router.get('/acts/list',verifyToken,Acts_list)
router.post('/act/new',verifyToken,Add_Act)
router.put('/act/update/:id',verifyToken,Update_Act)
router.delete('/act/delete')
router.get('/act/view',verifyToken,Act_by_Id)

export default router
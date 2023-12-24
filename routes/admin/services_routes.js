import { Get_Clauses,Get_Clause_by_Id,Update_Clause,Add_Clause_alternates, Create_clause,Switch_Clause_alternate,Delete_Clause_alternate } from "../../controllers/admin/clauses_controller.js";
import express from 'express'
import upload from '../../middleware/multer_middleware.mjs'
import { verifyToken } from "../../middleware/verify.mjs";
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));

router.get('/libraries/clauses',verifyToken,Get_Clauses)
router.get('/libraries/clause/view',verifyToken,Get_Clause_by_Id)
router.post('/libraries/clauses/update',verifyToken,Update_Clause)
router.post('/libraries/clause/alternate/new',verifyToken,Add_Clause_alternates)
router.post('/libraries/clauses/create',verifyToken,Create_clause)
router.post('/libraries/clauses/alternate/switch',Switch_Clause_alternate)
router.delete('/libraries/clauses/alternate/delete',Delete_Clause_alternate)



export default router
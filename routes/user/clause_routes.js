import express from 'express'
import { Get_Clauses,Get_Clause_by_Id,Search_Clauses,Get_Clause_by_name } from "../../controllers/user/clauses_controller.js";
import { verifyToken } from '../../middleware/verify.mjs';
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));

router.get('/allclauses',verifyToken,Get_Clauses)
router.get('/view/:id',verifyToken,Get_Clause_by_Id)
router.get('/view',verifyToken,Get_Clause_by_name)

// clausesai
router.get('/query',verifyToken,Search_Clauses)

export default router
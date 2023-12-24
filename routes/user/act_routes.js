import { GetActs,GetChapters,GetSections,GetSubSections,GetClauses,GetSubClauses } from '../../controllers/user/acts_controller.js';
import express from 'express'
import { verifyToken } from '../../middleware/verify.mjs';
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));

router.get('/acts/list',verifyToken,GetActs)
router.get('/act/chapters/list',verifyToken,GetChapters)
router.get('/act/chapter/sections/list',verifyToken,GetSections)
router.get('/act/chapter/section/subsections/list',verifyToken,GetSubSections)
router.get('/act/chapter/section/subsections/clauses/list',verifyToken,GetClauses)
router.get('/act/chapter/section/subsections/clauses/subclauses/list',verifyToken,GetSubClauses)


export default router
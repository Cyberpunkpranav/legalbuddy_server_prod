import { Sections_By_Chapter,Add_Section,Update_Section } from "../../controllers/admin/sections_controller.js";
import { SubSections_By_Section,Add_SubSection,Update_SubSection } from "../../controllers/admin/sub_section_controller.js";
import { Clause_By_SubSection ,Add_SubSection_Clause,Update_SubSection_Clause } from "../../controllers/admin/subsection_clauses_controller.js";
import { SubClause_By_Clause,Add_SubClause,Update_SubClause } from "../../controllers/admin/subclause_controller.js";
import { verifyToken } from "../../middleware/verify.mjs";
import express from 'express'
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));

router.get('/sections/list',verifyToken,Sections_By_Chapter)
router.post('/section/new',verifyToken,Add_Section)
router.put('/section/update/:id',verifyToken,Update_Section)
router.get('/section/subsections/list',verifyToken,SubSections_By_Section)
router.post('/section/subsection/new',verifyToken,Add_SubSection)
router.put('/section/subsection/update/:id',verifyToken,Update_SubSection)
router.get('/section/subsection/clauses/list',verifyToken,Clause_By_SubSection)
router.post('/section/subsection/clause/new',verifyToken,Add_SubSection_Clause)
router.put('/section/subsection/clause/update/:id',verifyToken,Update_SubSection_Clause)
router.get('/section/subsection/clause/subclauses/list',verifyToken,SubClause_By_Clause)
router.post('/section/subsection/clause/subclause/new',verifyToken,Add_SubClause)
router.put('/section/subsection/clause/subclause/upadte/:id',verifyToken,Update_SubClause)

export default router
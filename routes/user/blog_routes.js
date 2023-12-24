import express from 'express'
import { Get_Blogs,Get_Blogs_By_Search,View_Blog_by_Id } from '../../controllers/user/blogs_controller.js';
import  {verifyToken}  from '../../middleware/verify.mjs';
const app = express()
const router = express.Router()
app.use(express.urlencoded({ extended: true }));

router.get('/allblogs',verifyToken,Get_Blogs)
router.get('/allblogs/search',verifyToken,Get_Blogs_By_Search)
router.get('/view/:id',verifyToken,View_Blog_by_Id)
export default router
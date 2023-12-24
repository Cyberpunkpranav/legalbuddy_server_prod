import express, { response } from 'express'
import db from '../../config/database.js'
import multer from 'multer'
import bodyParser from 'body-parser'
import { response_data } from '../../config/config.js'
// import VerifyToken from '../../middleware/verify_token.mjs'

 const app = express()
 app.use(bodyParser.json())
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 
export const Get_Blogs_By_Search = (req,res,next)=>{
const limit = Number(req.query.limit)
const offset = Number(req.query.offset)
const token = req.headers.authorization;
// VerifyToken(token,req,res,next)
    let query = `SELECT * FROM blogs WHERE title LIKE "%${req.query.search}%" OR description LIKE "%${req.query.search}%" OR content LIKE "%${req.query.search}%" AND status=1 ORDER BY created_on desc LIMIT ? OFFSET ? `
    db.query(query,[limit,offset],(err,result)=>{
        if(err){
        next(err)
        }else{  
            response_data.status = true 
            response_data.message = 'blogs list'
            response_data.data = result
            res.json(response_data)
        }
    })
}

 export const Get_Blogs = (req,res,next)=>{

    const limit = Number(req.query.limit)
    const offset = Number(req.query.offset)
    const topic_id = req.query.topic_id !== undefined ? Number(req.query.topic_id):''
    const category_id  = req.query.category_id !== undefined ? Number(req.query.category_id):''
    const industry_id = req.query.industry_id !== undefined ? Number(req.query.industry_id):''
    let query ;
    const token = req.headers.authorization;
    // VerifyToken(token,req,res,next)
    if(topic_id || category_id || industry_id){
        query = `SELECT * FROM blogs WHERE topic_id = ? OR category_id = ? OR industry_id = ? AND status=1 ORDER BY created_on desc LIMIT ? OFFSET ? `
        db.query(query,[topic_id,category_id,industry_id,limit,offset],(err,result)=>{
            if(err){
            next(err)
            }else{
                response_data.status = true
                response_data.message = 'blogs list'
                response_data.data = result
                res.json(response_data)
            }
        })
    }else{
        query = `SELECT * FROM blogs WHERE status=1 ORDER BY created_on desc LIMIT ? OFFSET ? `
        db.query(query,[limit,offset],(err,result)=>{
            if(err){
            next(err)
            }else{
                response_data.status = true
                response_data.message = 'blogs list'
                response_data.data = result
                res.json(response_data)
            }
        }) 
    }
 }
 export const View_Blog_by_Id = (req,res,next)=>{
    const token = req.headers.authorization;
    // VerifyToken(token,req,res,next)
    const id = Number(req.params.id)
    const query = 'SELECT * FROM blogs WHERE id = ?'
      db.query(query,[id],(err,result)=>{
        if(err){
          next(err)
        }else{
          response_data.message=''
          response_data.status=true
          response_data.data = result
          res.json(response_data)
        }
      })
  
  } 
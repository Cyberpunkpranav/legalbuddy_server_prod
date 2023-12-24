import express from 'express'
import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import VerifyToken from '../../middleware/verify_token.mjs'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


export const Chapters_By_Act = (req,res,next)=>{
    const act_id = Number(req.query.act_id)
    const search = req.query.search
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)

    try {
        if(act_id){
            if(search !== undefined){
            let query = `SELECT * FROM mca_chapters WHERE chapter LIKE "%${search}%" AND act_id = ?`
                db.query(query,[act_id],((err,result)=>{
                    if(err){
                        next(err)
                    }else{
                        response_data.data=result
                        response_data.message = 'Chapters list'
                        response_data.status = true
                        response_data.access_token = ''
                        res.json(response_data)
                    }
                }))
            }else{
            let query = `SELECT * FROM mca_chapters WHERE act_id = ?`
            db.query(query,[act_id],((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = 'Chapters list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            })) 
        } 
    }else{
        response_data.data = []
        response_data.message = 'Choose Act to get chapters'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
    } catch (error) {
        res.json(error)
    }
}

export const Add_Chapter = (req,res,next)=>{
const act_id = Number(req.body.act_id)
const chapter_part = Number(req.body.chapter_part)
const chapter = req.body.chapter
const chapter_number = req.body.chapter_number
const token = req.headers.authorization;
//    VerifyToken(token,req,res,next)

if(act_id){
    const query = 'INSERT into mca_chapters (`act_id`,`chapter_number`,`chapter_part`,`chapter`) VALUES(?,?,?,?)'
    db.query(query,[act_id,chapter_number,chapter_part,chapter],(err,result)=>{
        if(err){
            next(err)
        }else{
            const token_data = {
                id:result.insertId,
                act_id:act_id,
            }
            try {
                const Token =  jwt.sign(token_data,'chapter_token')
                const query2 = 'Update mca_chapters set token = ? WHERE id=? '
                db.query(query2,[Token,result.insertId],((err,result)=>{
                    if(err){
                        next(err)
                    }else{
                        response_data.data = []
                        response_data.message  = 'Chapter Saved Successfully'
                        response_data.status = true
                        res.json(response_data)
                    }
                }))
           
            } catch (error) {
                next(error)
            }
        }
    })
}else{
    response_data.data = []
    response_data.message = "Please choose Act to save the chapter"
    response_data.status =  false
    res.json(response_data)
}
}

export const Update_Chapter = (req,res,next)=>{
    const id = req.params.id
    const act_id = Number(req.body.act_id)
    const chapter_number = req.body.chapter_number
    const chapter_part =req.body.chapter_part?Number(req.body.chapter_part):""
    const chapter = req.body.chapter
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)
    const token_data = {
        id:id,
        act_id:act_id
    }
    const Token =  jwt.sign(token_data,'chapter_token')
      try {
        const query = 'UPDATE mca_chapters SET act_id=?, chapter_number = ? ,chapter_part = ?, chapter = ?, token = ? WHERE id = ?'
        db.query(query,[act_id,chapter_number,chapter_part,chapter,Token,id],(err,result)=>{
          if(err){
            next(err)
          }else{
            response_data.message = 'Chapter Updated Succesfully'
            response_data.status = true
            response_data.data = ''
            res.json(response_data)
          }
        })
      } catch (error) {
          next(error)
      }
    
}
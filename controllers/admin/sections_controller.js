import express from 'express'
import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import bodyParser from 'body-parser'
import VerifyToken from '../../middleware/verify_token.mjs'
import jwt from 'jsonwebtoken'

const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

export const Sections_By_Chapter = (req,res,next)=>{
    const act_id = Number(req.query.act_id)
    const chapter_id = Number(req.query.chapter_id)
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)

    try {
        if(chapter_id && act_id){
            const query = `SELECT * FROM mca_sections WHERE chapter_id = ? AND act_id = ?`
            db.query(query,[chapter_id,act_id],((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = 'Sections list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            })) 
    }else{
        response_data.data = []
        response_data.message = 'Choose Chapter and Act to get sections'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
    } catch (error) {
        next(error)
    }
}

export const Add_Section = (req,res,next)=>{
    const act_id = Number(req.body.act_id)
    const chapter_id = Number(req.body.chapter_id)
    const section_number = req.body.section_number
    const notified_date = req.body.notified_date
    const section = req.body.section
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)

    if(act_id&&chapter_id){
        const query = 'INSERT into mca_sections (`act_id`,`chapter_id`,`section_number`,`notified_date`,`section`) VALUES(?,?,?,?,?)'
        db.query(query,[act_id,chapter_id,section_number,notified_date,section],(err,result)=>{
            if(err){
                next(err)
            }else{
                const token_data = {
                    id:result.insertId,
                    chapter_id_id:chapter_id,
                    act_id:act_id,
                }
                try {
                    const Token =  jwt.sign(token_data,'section_token')
                    const query2 = 'Update mca_sections set token = ? WHERE id=? '
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
                response_data.data = []
                response_data.message  = 'Section Saved Successfully'
                response_data.status = true
                res.json(response_data)
            }
        })
    }else{
        response_data.data = []
        response_data.message = "Please choose Act and Chapter to save the chapter"
        response_data.status =  false
        res.json(response_data)
    }
    }

    export const Update_Section = (req,res,next)=>{
        const id = Number(req.params.id)
        const act_id = Number(req.body.act_id)
        const chapter_id = Number(req.body.chapter_id)
        const section_number = req.body.section_number
        const notified_date = req.body.notified_date
        const section = req.body.section
        const token = req.headers.authorization;
        //    VerifyToken(token,req,res,next)
        const token_data = {
            id:id,
            act_id:act_id,
            chapter_id:chapter_id
        }
        const Token =  jwt.sign(token_data,'section_token')
        if(act_id&&chapter_id){
            try {
                const query = 'UPDATE mca_sections SET act_id=?,chapter_id=?,section_number = ?,notified_date = ? ,section = ? ,token = ? WHERE id = ?'
                db.query(query,[act_id,chapter_id,section_number,notified_date,section,Token,id],(err,result)=>{
                  if(err){
                    next(err)
                  }else{
                    response_data.message = 'Section Updated Succesfully'
                    response_data.status = true
                    response_data.data = ''
                    res.json(response_data)
                  }
                })
              } catch (error) {
                  next(error)
              }
        }else{
            response_data.data = []
            response_data.message = 'Select Act and Chapter to update the section '
            response_data.status = false
            response_data.access_token=''
            res.json(response_data)
        } 
      }
import express from 'express'
import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import bodyParser from 'body-parser'
import VerifyToken from '../../middleware/verify_token.mjs'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

export const Clause_By_SubSection= (req,res,next)=>{
    const act_id = Number(req.query.act_id)
    const section_id = Number(req.query.section_id)
    const chapter_id = Number(req.query.chapter_id)
    const subsection_id = Number(req.query.subsection_id)
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)
    try {
        if(chapter_id && act_id&&section_id&&subsection_id){
            const query = `SELECT * FROM mca_clauses WHERE chapter_id = ? AND act_id = ? AND section_id = ? AND subsection_id = ?`
            db.query(query,[chapter_id,act_id,section_id,subsection_id],((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = 'Subsection clauses list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            })) 
    }else{
        response_data.data = []
        response_data.message = 'Choose Chapter, Act, Section AND subsection to get clauses'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
    } catch (error) {
        res.json(error)
    }
}

export const Add_SubSection_Clause = (req,res,next)=>{
    const act_id = Number(req.body.act_id)
    const chapter_id = Number(req.body.chapter_id)
    const section_id = Number(req.body.section_id)
    const subsection_id = Number(req.body.subsection_id)
    const clause_number = req.body.clause_number
    const clause = req.body.content
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)
    
    if(act_id&&chapter_id&&section_id&&subsection_id){
        const query = 'INSERT into mca_clauses (`act_id`,`chapter_id`,`section_id`,`subsection_id`,`clause_number`,`clause`) VALUES(?,?,?,?,?,?)'
        db.query(query,[act_id,chapter_id,section_id,subsection_id,clause_number,clause],(err,result)=>{
            if(err){
                next(err)           
            }else{
                response_data.data = []
                response_data.message  = 'Sub section Clause Saved Successfully'
                response_data.status = true
                res.json(response_data)
            }
        })
    }else{
        response_data.data = []
        response_data.message = "Please choose Act, Chapter, Section and Subsection to save the clause"
        response_data.status =  false
        res.json(response_data)
    }
    }

    export const Update_SubSection_Clause = (req,res,next)=>{
        const id = Number(req.params.id)
        const act_id = Number(req.body.act_id)
        const section_id = Number(req.body.section_id)
        const chapter_id = Number(req.body.chapter_id)
        const subsection_id = Number(req.body.subsection_id)
        const clause_number = req.body.clause_number
        const clause = req.body.content
        const token = req.headers.authorization;
        //    VerifyToken(token,req,res,next)
        
        if(act_id&&chapter_id&&section_id&&subsection_id){
            try {
                const query = 'UPDATE mca_clauses SET act_id=?,chapter_id=?,section_id = ?,subsection_id = ?, clause_number = ? ,clause = ? WHERE id = ?'
                db.query(query,[act_id,chapter_id,section_id,subsection_id,clause_number,clause,id],(err,result)=>{
                  if(err){
                    next(err)
                  }else{
                    response_data.message = 'SubSection Clause Updated Succesfully'
                    response_data.status = true
                    response_data.data = []
                    res.json(response_data)
                  }
                })
              } catch (error) {
                  next(error)
              }
        }else{
            response_data.data = []
            response_data.message = 'Select Act, Chapter, Section and Subsection to update the subsection clause '
            response_data.status = false
            response_data.access_token=''
            res.json(response_data)
        } 
    }
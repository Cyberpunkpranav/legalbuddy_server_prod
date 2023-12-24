import express from 'express'
import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import bodyParser from 'body-parser'
import VerifyToken from '../../middleware/verify_token.mjs'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

export const SubClause_By_Clause= (req,res,next)=>{
    const act_id = Number(req.query.act_id)
    const section_id = Number(req.query.section_id)
    const chapter_id = Number(req.query.chapter_id)
    const subsection_id = Number(req.query.subsection_id)
    const clause_id = Number(req.query.clause_id)
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)
    try {
        if(chapter_id && act_id&&section_id&&subsection_id&&clause_id){
            const query = `SELECT * FROM mca_subclauses WHERE chapter_id = ? AND act_id = ? AND section_id = ? AND subsection_id = ? AND clause_id = ?`
            db.query(query,[chapter_id,act_id,section_id,subsection_id,clause_id],((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = ' Sub clauses list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            })) 
    }else{
        response_data.data = []
        response_data.message = 'Choose Chapter, Act, Section,Subsection AND Clause to get subclauses'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
    } catch (error) {
        next(error)
    }
}

export const Add_SubClause = (req,res,next)=>{
    const act_id = Number(req.body.act_id)
    const chapter_id = Number(req.body.chapter_id)
    const section_id = Number(req.body.section_id)
    const subsection_id = Number(req.body.subsection_id)
    const clause_id = Number(req.body.clause_id)
    const subclause_number = req.body.subclause_number
    const subclause = req.body.content
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)
    if(act_id&&chapter_id&&section_id&&subsection_id&&clause_id){
        const query = 'INSERT into mca_subclauses (`act_id`,`chapter_id`,`section_id`,`subsection_id`,`clause_id`,`subclause_number`,`subclause`) VALUES(?,?,?,?,?,?,?)'
        db.query(query,[act_id,chapter_id,section_id,subsection_id,clause_id,subclause_number,subclause],(err,result)=>{
            if(err){
                next(err)           
            }else{
                response_data.data = []
                response_data.message  = 'Sub Clause Saved Successfully'
                response_data.status = true
                res.json(response_data)
            }
        })
    }else{
        response_data.data = []
        response_data.message = "Please choose Act, Chapter, Section, Subsection and Clause to save the sub-clause"
        response_data.status =  false
        res.json(response_data)
    }
    }

    export const Update_SubClause = (req,res,next)=>{
        const id = Number(req.params.id)
        const act_id = Number(req.body.act_id)
        const section_id = Number(req.body.section_id)
        const chapter_id = Number(req.body.chapter_id)
        const subsection_id = Number(req.body.subsection_id)
        const clause_id = Number(req.body.clause_id)
        const subclause_number = req.body.subclause_number
        const subclause = req.body.content
        const token = req.headers.authorization;
        //    VerifyToken(token,req,res,next)
        if(act_id&&chapter_id&&section_id&&subsection_id&&clause_id){
            try {
                const query = 'UPDATE mca_subclauses SET act_id=?,chapter_id=?,section_id = ?,subsection_id = ?, clause_id=?, subclause_number = ? ,subclause = ? WHERE id = ?'
                db.query(query,[act_id,chapter_id,section_id,subsection_id,clause_id,subclause_number,subclause,id],(err,result)=>{
                  if(err){
                    next(err)
                  }else{
                    response_data.message = 'Sub Clause Updated Succesfully'
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
            response_data.message = 'Select Act, Chapter, Section, Subsection and Clause to update the Sub-clause '
            response_data.status = false
            response_data.access_token=''
            res.json(response_data)
        } 
    }
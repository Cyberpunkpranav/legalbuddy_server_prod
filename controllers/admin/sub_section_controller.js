import express from 'express'
import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import bodyParser from 'body-parser'
import VerifyToken from '../../middleware/verify_token.mjs'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


export const SubSections_By_Section= (req,res,next)=>{
    const act_id = Number(req.query.act_id)
    const section_id = Number(req.query.section_id)
    const chapter_id = Number(req.query.chapter_id)
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)

    try {
        if(chapter_id && act_id&&section_id){
            const query = `SELECT * FROM mca_subsections WHERE chapter_id = ? AND act_id = ? AND section_id = ?`
            db.query(query,[chapter_id,act_id,section_id],((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = 'SubSections list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            })) 
    }else{
        response_data.data = []
        response_data.message = 'Choose Chapter, Act and Section to get subsections'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
    } catch (error) {
        next(error)
    }
}

export const Add_SubSection = (req,res,next)=>{
    const act_id = Number(req.body.act_id)
    const chapter_id = Number(req.body.chapter_id)
    const section_id = Number(req.body.section_id)
    const subsection_number = req.body.subsection_number
    const subsection = req.body.content
    const token = req.headers.authorization;
    //    VerifyToken(token,req,res,next)
    
    if(act_id&&chapter_id&&section_id){
        const query = 'INSERT into mca_subsections (`act_id`,`chapter_id`,`section_id`,`subsection_number`,`subsection`) VALUES(?,?,?,?,?)'
        db.query(query,[act_id,chapter_id,section_id,subsection_number,subsection],(err,result)=>{
            if(err){
                next(err)           
            }else{
                response_data.data = []
                response_data.message  = 'SubSection Saved Successfully'
                response_data.status = true
                res.json(response_data)
            }
        })
    }else{
        response_data.data = []
        response_data.message = "Please choose Act, Chapter and Section to save the subsection"
        response_data.status =  false
        res.json(response_data)
    }
    }

    export const Update_SubSection = (req,res,next)=>{
        const id = Number(req.params.id)
        const act_id = Number(req.body.act_id)
        const section_id = Number(req.body.section_id)
        const chapter_id = Number(req.body.chapter_id)
        const subsection_number = req.body.subsection_number
        const subsection = req.body.content
        const token = req.headers.authorization;
        //    VerifyToken(token,req,res,next)

        if(act_id&&chapter_id&&section_id&&chapter_id){
            try {
                const query = 'UPDATE mca_subsections SET act_id=?,chapter_id=?,section_id = ?, subsection_number = ? ,subsection = ? WHERE id = ?'
                db.query(query,[act_id,chapter_id,section_id,subsection_number,subsection,id],(err,result)=>{
                  if(err){
                    next(err)
                  }else{
                    response_data.message = 'SubSection Updated Succesfully'
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
            response_data.message = 'Select Act, Chapter and Section to update the subsection '
            response_data.status = false
            response_data.access_token=''
            res.json(response_data)
        } 
      }
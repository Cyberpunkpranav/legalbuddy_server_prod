import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import express from 'express'
import bodyParser from 'body-parser'
import VerifyToken from '../../middleware/verify_token.mjs'
import  jwt  from 'jsonwebtoken'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

export const Acts_list = (req,res,next)=>{
    const search = req.query.search
    const token = req.headers.authorization;
 //    VerifyToken(token,req,res,next)

    try {
        if(search != undefined){
            const query = `SELECT * FROM mca_acts WHERE act LIKE "%${search}%" `
            db.query(query,((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = 'Acts list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            }))
        }else{
            const query = `SELECT * FROM mca_acts`
            db.query(query,((err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data=result
                    response_data.message = 'Acts list'
                    response_data.status = true
                    response_data.access_token = ''
                    res.json(response_data)
                }
            })) 
        }
        
    } catch (error) {
        next(error)
    }
}
export const Add_Act=(req,res,next)=>{
    const act = req.body.act
    const description = req.body.description
    const act_number = req.body.act_number
    const act_year = req.body.act_year
    const amendment = req.body.amendment
    const status = Number(req.body.status)
    const token = req.headers.authorization;
 //    VerifyToken(token,req,res,next)

    const query = 'INSERT INTO mca_acts (`act`,`description`,`act_number`,`act_year`,`amendment`,`status`) VALUES(?,?,?,?,?,?)'
    try {
        db.query(query,[act,description,act_number,act_year,amendment,status],((err,result)=>{
            if(err){
                next(err)
            }else{
                const token_data = {
                    id:result.insertId,
                }
                try {
                    const Token =  jwt.sign(token_data,'act_token')
                    const query2 = 'Update mca_acts set token = ? WHERE id=? '
                    db.query(query2,[Token,result.insertId],((err,result)=>{
                        if(err){
                            next(err)
                        }else{
                            response_data.data=''
                            response_data.message = 'Act Added Succesfully'
                            response_data.status = true
                            response_data.access_token=''
                            res.json(response_data)
                        }
                    }))
               
                } catch (error) {
                    next(error)
                }
            }
        }))
    } catch (error) {
        next(error)
    }

}
export const Update_Act = (req,res,next)=>{
    const id = Number(req.params.id)
    const act = req.body.act
    const description = req.body.description
    const act_number = req.body.act_number
    const act_year = req.body.act_year
    const amendment = req.body.amendment
    const status = Number(req.body.status)
    const token = req.headers.authorization;
 //    VerifyToken(token,req,res,next)
    const token_data = {
        id:id
    }
    const Token =  jwt.sign(token_data,'act_token')
    const query = 'UPDATE mca_acts SET act=?,description=?,act_number=?,act_year =?,amendment=?,status=?,token=? WHERE id=?'
    try {
        db.query(query,[act,description,act_number,act_year,amendment,status,Token,id],((err,result)=>{
            if(err){
                next(err)
            }else{
                response_data.data=''
                response_data.message = 'Act Updated Successfully'
                response_data.status = true
                response_data.access_token=''
                res.json(response_data)
            }
        }))
    } catch (error) {
        next(error)
    }
}
export const Act_by_Id = (req,res,next)=>{
    const id = Number(req.query.id)
    const token = req.headers.authorization;
 //    VerifyToken(token,req,res,next)
    
    const query = 'SELECT * FROM mca_acts WHERE id = ?'
      db.query(query,[id],(err,result)=>{
        if(err){
          next(err)
        }else{
          response_data.message=''
          response_data.status=true
          response_data.data = result
          res.json(result)
        }
      })
  
} 
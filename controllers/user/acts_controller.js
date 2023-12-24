import express from 'express'
import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import bodyParser from 'body-parser'
import VerifyToken from '../../middleware/verify_token.mjs'
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

export const GetActs = (req,res,next)=>{
    const search = req.query.search
    const token = req.headers.authorization;
    //  VerifyToken(token,req,res,next)
    if(req.query.search !== undefined){
        try {
            const query = `SELECT * from mca_acts WHERE act LIKE "%${search}%" AND status=1 ORDER BY created_on asc`
            db.query(query,(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Acts list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }
    }else{
        try {
            const query = `SELECT * from mca_acts WHERE status=1 ORDER BY created_on asc `
            db.query(query,(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Acts list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }
    }   
  
}

export const GetChapters = (req,res,next)=>{
    const act_id = req.query.act_id
    const search = req.query.search
    const token = req.headers.authorization;
    //  VerifyToken(token,req,res,next)
    if(act_id){
    if(req.query.search !== undefined){
        try {
            const query = `SELECT * from mca_chapters WHERE chapter LIKE "%${search}%" AND status=1 AND act_id= ? ORDER BY created_on asc`
            db.query(query,[act_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Chapters list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }
    }else{
        try {
            const query = `SELECT * from mca_chapters WHERE status=1 AND act_id = ? ORDER BY created_on asc `
            db.query(query,[act_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Chapters list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }
    }   
}else{
    response_data.data = []
    response_data.message='Please choose act to get Chapters'
    response_data.status = false
    response_data.access_token = ''
    res.json(response_data)
}
}

export const GetSections = (req,res,next)=>{
    const act_id = req.query.act_id
    const chapter_id = req.query.chapter_id
    const search = req.query.search
    const token = req.headers.authorization;
    //  VerifyToken(token,req,res,next)
    if(act_id&&chapter_id){
    if(req.query.search !== undefined){
        try {
            const query = `SELECT * from mca_sections WHERE section LIKE "%${search}%" AND status=1 AND act_id= ? AND chapter_id =? ORDER BY created_on asc`
            db.query(query,[act_id,chapter_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Sections list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }
    }else{
        try {
            const query = `SELECT * from mca_chapters WHERE status=1 AND act_id = ? AND chapter_id = ? ORDER BY created_on asc `
            db.query(query,[act_id,chapter_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Sections list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }
    }   
}else{
    response_data.data = []
    response_data.message='Please choose act and chapter to get sections'
    response_data.status = false
    response_data.access_token = ''
    res.json(response_data)
}
}

export const GetSubSections = (req,res,next)=>{
    const act_id = req.query.act_id
    const chapter_id = req.query.chapter_id
    const section_id = req.query.section_id
    const token = req.headers.authorization
    //  VerifyToken(token,req,res,next)

    if(act_id&&chapter_id&&section_id){
        try {
            const query = `SELECT * from mca_subsections WHERE status=1 AND act_id = ? AND chapter_id = ? AND section_id = ? ORDER BY created_on asc `
            db.query(query,[act_id,chapter_id,section_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'SubSections list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }

    }else{
        response_data.data = []
        response_data.message='Please choose act, chapter and section to get sections'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
}

export const GetClauses = (req,res,next)=>{
    const act_id = req.query.act_id
    const chapter_id = req.query.chapter_id
    const section_id = req.query.section_id
    const token = req.headers.authorization 
    //  VerifyToken(token,req,res,next)

    if(act_id&&chapter_id&&section_id){
        try {
            const query = `SELECT * FROM mca_clauses WHERE status=1 AND act_id = ? AND chapter_id = ? AND section_id = ? ORDER BY created_on asc `
            db.query(query,[act_id,chapter_id,section_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'Clauses list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }

    }else{
        response_data.data = []
        response_data.message='Please choose act, chapter and section to get clauses'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
}

export const GetSubClauses = (req,res,next)=>{
    const act_id = req.query.act_id
    const chapter_id = req.query.chapter_id
    const section_id = req.query.section_id
    const token = req.headers.authorization
    //  VerifyToken(token,req,res,next)

    if(act_id&&chapter_id&&section_id){
        try {
            const query = `SELECT * FROM mca_subclauses WHERE status=1 AND act_id = ? AND chapter_id = ? AND section_id = ? ORDER BY created_on asc `
            db.query(query,[act_id,chapter_id,section_id],(err,result)=>{
                if(err){
                    next(err)
                }else{
                    response_data.data = result
                    response_data.message = 'SubClauses list'
                    response_data.access_token = ''
                    response_data.status = true
                    res.json(response_data)
                }
            })
        } catch (error) {
            next(error)
        }

    }else{
        response_data.data = []
        response_data.message='Please choose act, chapter and section to get subclauses'
        response_data.status = false
        response_data.access_token = ''
        res.json(response_data)
    }
}
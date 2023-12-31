import db from '../../config/database.js'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import {response_data} from '../../config/config.js'
import {GetObjects} from '../../middleware/S3_bucket.mjs'
import {promises, readFileSync } from 'fs'
// import VerifyToken from '../../middleware/verify_token.mjs'
const currentDir = dirname(fileURLToPath(import.meta.url));


export const Get_Clauses = (req,res,next)=>{
    const limit = Number(req.query.limit)
    const offset = Number(req.query.offset)
    const token = req.headers.authorization;
    //  VerifyToken(token,req,res,next)
    let query;
    if(req.query.search !=undefined){
     query = `SELECT * from public_clauses WHERE clause_name LIKE "%${req.query.search}%" AND status=1 LIMIT ? OFFSET ? `
     db.query(query,[limit,offset],((err,result)=>{
        if(err){
            next(err)
        }else{
            response_data.data = result
            response_data.message = 'Clauses list'
            response_data.status = true
            res.json(response_data)
        }
    }))
    }else{
        query = `SELECT * from public_clauses AND status = 1 ORDER BY id LIMIT ? OFFSET ? `
        db.query(query,[limit,offset],((err,result)=>{
            if(err){
                next(err)
            }else{
                response_data.data = result
                response_data.message = 'Clauses list'
                response_data.status = true
                res.json(response_data)
            }
        }))
    }

}
async function Get_clause_By_id_helper(id,res,next){
return  new Promise((resolve,reject)=>{
   let query = `SELECT * FROM public_clause_alternates WHERE public_clause_alternates.clause_id=? AND status=1`
    db.query(query,[id],(async(err,result)=>{
        if(err){
            res.json(err)
            // next(err)   
        }else{
            let arr = []
            for(let i=0; i<result.length;i++){
                try {
                    // let file_path = join(currentDir, '..', '..', 'assets', 'clauses', result[i].file_name);
                    // const data = readFileSync(file_path, 'utf8' )
                    let S3_URL_Simple,S3_URL_Moderate,S3_URL_Complex;
                    if(result[i].simple !==undefined && result[i].simple !==null){
                     S3_URL_Simple = await GetObjects(`assets/clauses/${result[i].simple}`)
                    }
                    if(result[i].moderate !== undefined && result[i].moderate !== null){
                        S3_URL_Moderate = await GetObjects(`assets/clauses/${result[i].moderate}`)
                    }
                    if(result[i].complex !== undefined && result[i].complex !==null){
                        S3_URL_Complex = await GetObjects(`assets/clauses/${result[i].complex}`)
                    }

                      res.setHeader('Content-Type', 'text/html');
                      let obj = {
                        id:result[i].id,
                        rationale:result[i].rationale,
                        explaination:result[i].explaination,
                        clause_id: result[i].clause_id,
                        nature: result[i].nature,
                        simple: S3_URL_Simple !==undefined?S3_URL_Simple:'',
                        moderate:S3_URL_Moderate!==undefined?S3_URL_Moderate:'',
                        complex:S3_URL_Complex!==undefined ?S3_URL_Complex:'',
                        status: result[i].status,
                        created_on: result[i].created_on,
                        updated_on: result[i].updated_on
                    }
                    arr.push(obj)   
                } catch (error) {
                  next(error);
                }
            }
            resolve(arr)
        }
    }))
})
}
let response  = {
    clause_name:'',
    definition:'',
    rationale:'',
    clauses:[],
    status:'',
}
export const Get_Clause_by_Id =async(req,res,next)=>{
    let query;
    const token = req.headers.authorization;
    //  VerifyToken(token,req,res,next)
    const id = req.params.id
    
    try {
        query = `SELECT clause_name,definition,rationale FROM public_clauses WHERE id = ?`
             db.query(query,[id],(async(err,result)=>{
            if(err){
                next(err)
            }else{
                response.clause_name = result[0].clause_name
                response.definition = result[0].definition
                response.rationale = result[0].rationale
                response.status = true
            }
        }))
        const clauses =  await Get_clause_By_id_helper(id,res,next)
        response.clauses = clauses
        res.json(response)
    } catch (error) {
        next(error)
    }

}
// clausesai
export const Search_Clauses = (req,res,next)=>{
    const search =  req.query.search
    if(search !==undefined){
        const query = `SELECT id,clause_name,definition,rationale from public_clauses WHERE clause_name LIKE "%${search}%" OR definition LIKE "%${search}%" OR rationale LIKE "%${search}%" AND status=1 `
        db.query(query,((err,result)=>{
           if(err){
               next(err)
           }else{
               response_data.data = result
               response_data.message = 'Searched Clauses'
               response_data.status = true
               res.json(response_data)
           }
       }))
    }

}
async function Get_clause_By_name_helper(id,res,next){
    return  new Promise((resolve,reject)=>{
       let query = `SELECT * FROM public_clause_alternates WHERE public_clause_alternates.clause_id=? AND status=1`
        db.query(query,[id],(async(err,result)=>{
            if(err){
                res.json(err)
                // next(err)   
            }else{
                let arr = []
                for(let i=0; i<result.length;i++){
                    try {
                        // let file_path = join(currentDir, '..', '..', 'assets', 'clauses', result[i].file_name);
                        // const data = readFileSync(file_path, 'utf8' )
                        let S3_URL_Simple,S3_URL_Moderate,S3_URL_Complex;
                        if(result[i].simple !==undefined && result[i].simple !==null){
                         S3_URL_Simple = await GetObjects(`assets/clauses/${result[i].simple}`)
                        }
                        if(result[i].moderate !== undefined && result[i].moderate !== null){
                            S3_URL_Moderate = await GetObjects(`assets/clauses/${result[i].moderate}`)
                        }
                        if(result[i].complex !== undefined && result[i].complex !==null){
                            S3_URL_Complex = await GetObjects(`assets/clauses/${result[i].complex}`)
                        }
    
                          res.setHeader('Content-Type', 'text/html');
                          let obj = {
                            id:result[i].id,
                            rationale:result[i].rationale,
                            explaination:result[i].explaination,
                            clause_id: result[i].clause_id,
                            nature: result[i].nature,
                            simple: S3_URL_Simple !==undefined?S3_URL_Simple:'',
                            moderate:S3_URL_Moderate!==undefined?S3_URL_Moderate:'',
                            complex:S3_URL_Complex!==undefined ?S3_URL_Complex:'',
                            status: result[i].status,
                            created_on: result[i].created_on,
                            updated_on: result[i].updated_on
                        }
                        arr.push(obj)   
                    } catch (error) {
                      next(error);
                    }
                }
                resolve(arr)
            }
        }))
    })
    }
export const Get_Clause_by_name =async(req,res,next)=>{
    let query;
    const clause_name = req.query.clause_name
    try {   
        query = `SELECT id, clause_name,definition,rationale FROM public_clauses WHERE clause_name = ?`
             db.query(query,[clause_name],(async(err,result)=>{
            if(err){
                next(err)
            }else{
                const clauses =  await Get_clause_By_name_helper(result[0].id,res,next)
                response.clauses = clauses
                response.clause_name = result[0].clause_name
                response.definition = result[0].definition
                response.rationale = result[0].rationale
                response.status = true
                res.json(response)
            }
        }))

    } catch (error) {
        next(error)
    }

}
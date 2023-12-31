import db from '../../config/database.js'
import { fileURLToPath } from 'url'
import { dirname,join } from 'path'
import {response_data} from '../../config/config.js'
import {readFileSync, writeFileSync,existsSync } from 'fs'
import VerifyToken from '../../middleware/verify_token.mjs'
import {PutObject, GetObjects} from '../../middleware/S3_bucket.mjs'

const currentDir = dirname(fileURLToPath(import.meta.url));

export const Create_clause = async(req,res,next)=>{
  const token = req.headers.authorization;

  const query = 'INSERT into public_clauses (`clause_name`,`definition`,`rationale`) VALUES (?,?,?)'
  db.query(query,[req.body.clause_name,req.body.definition,req.body.rationale],((err,result)=>{

    if(err){
      next(err)
    }else{
      response_data.access_token=''
      response_data.data=''
      response_data.message='Clause Created Succesfully'
      response_data.status = true
      res.json(response_data)
    }
  }))
}

export const Get_Clauses = (req,res,next)=>{
    const limit = Number(req.query.limit)
    const offset = Number(req.query.offset)

    let query;
    if(req.query.search !=undefined){
     query = `SELECT * from public_clauses WHERE clause_name LIKE "%${req.query.search}%" LIMIT ? OFFSET ? `
     db.query(query,[limit,offset],((err,result)=>{
        if(err){
            res.json(err)
        }else{
            response_data.data = result
            response_data.message = 'Clauses list'
            response_data.status = true
            res.json(response_data)
        }
    }))
    }else{
        query = `SELECT * from public_clauses ORDER BY id LIMIT ? OFFSET ? `
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
async function Get_clause_by_id_helper(id,res,next) {
    // Replace this with your actual query logic
    return new Promise((resolve, reject) => {
       let query = `SELECT * FROM public_clause_alternates WHERE public_clause_alternates.clause_id=?`
        db.query(query,[id],(async(err,result)=>{
            if(err){ 
               next(err)
            }else{
                let arr = []
                for(let i=0; i<result.length;i++){
                  let data = '<p></p>'
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
                            clause_id: result[i].clause_id,
                            rationale:result[i].rationale,
                            nature:result[i].nature,
                            explaination :result[i].explaination,
                            simple: S3_URL_Simple !==undefined?S3_URL_Simple:'',
                            moderate:S3_URL_Moderate!==undefined?S3_URL_Moderate:'',
                            complex:S3_URL_Complex!==undefined ?S3_URL_Complex:'',
                            status: result[i].status,
                            created_on: result[i].created_on,
                            updated_on: result[i].updated_on
                        }
                        arr.push(obj)   
                }
                resolve(arr)                
            }
        }))
    });
}
export const Get_Clause_by_Id = async (req,res,next)=>{
        const id = Number(req.query.id)
       const Get_clauseName = async()=>{
        let res;
        const query = `SELECT * FROM public_clauses WHERE id = ?`
        return new Promise((resolve, reject) => {
          db.query(query,[id],((err,result)=>{
            if(err){
              res.json(err)
            }else{
              res = result[0]
              resolve(res)
            }
          }))

        })
       }
        try {
          const data = await Get_clauseName()
          const clauses =  await Get_clause_by_id_helper(id,res,next)
          let clause_response  = {
            clause_name:data.clause_name,
            definition:data.definition,
            rationale:data.rationale,
            clauses:clauses,
            status:true
          }
        res.json(clause_response)
        } catch (error) {
          next(error)
        }

}

async function Update_clause_helper(id,clause_name,rationale,nature,explaination,status,simple,moderate,complex,next) {
    // Replace this with your actual query logic
    const simple_filename = clause_name+'_'+nature+'_'+'simple.html'
    const moderate_filename = clause_name+'_'+nature+'_'+'moderate.html'
    const complex_filename = clause_name+'_'+nature+'_'+'complex.html'
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let query ='UPDATE public_clause_alternates SET rationale=?,nature=?,explaination=?, simple = ? , moderate = ?, complex = ?,status = ? WHERE id = ?';
        db.query(query, [rationale,nature,explaination,simple_filename,moderate_filename,complex_filename, status, id],((err,result)=>{
           if(err){
              next(err)
           }else{   
              //  writeFileSync(paths, clause, 'utf8');
              const Write_in_S3 =async()=>{
               const res =  await PutObject(`assets/clauses/${simple_filename}`,simple)
                const res2 = await PutObject(`assets/clauses/${moderate_filename}`,moderate)
                const res3 = await PutObject(`assets/clauses/${complex_filename}`,complex)
              }
              Write_in_S3()
              resolve(result)
           }
       }))
      }, 1000);
    });
}
export const Update_Clause = async (req,res,next) => {
    const Id = Number(req.body.id);
    const clause_name = req.body.clause_name;
    const definition = req.body.definition;
    const clause_rationale = req.body.rationale
    const clauses = req.body.clauses;

    try {
      let query = 'UPDATE public_clauses SET clause_name = ?, definition = ?,rationale =?  WHERE id = ?';
       db.query(query, [clause_name, definition,clause_rationale, Id]);
  
      for (let i = 0; i < clauses.length; i++) {
        let id = Number(clauses[i].id);
        let rationale = clauses[i].rationale ?clauses[i].rationale:''
        let explaination = clauses[i].explaination?clauses[i].explaination:''
        let simple = clauses[i].simple;
        let moderate = clauses[i].moderate;
        let complex = clauses[i].complex;
        let nature = clauses[i].nature;
        let status = clauses[i].status;
        // let paths = join(currentDir, '..', '..', 'assets', 'clauses', filename);
        await Update_clause_helper(id,clause_name,rationale,nature,explaination,status,simple,moderate,complex,next)
      }
      response_data.data = ''
      response_data.status = true
      response_data.access_token = ''
      response_data.message = 'Clauses updated sucessfully'
      res.json(response_data);
    } catch (err) {
    next(err);
    }
}  
export const Add_Clause_alternates  = async(req,res,next)=>{

    const clause_id = req.body.clause_id;
    const clause_name = req.body.clause_name;
    const simple = req.body.simple;
    const moderate = req.body.moderate;
    const complex = req.body.complex;
    const rationale =  req.body.rationale
    const nature = req.body.nature
    const explaination = req.body.explaination
    const status = req.body.status;
    const simple_filename = clause_name+'_'+nature+'_'+'simple.html'
    const moderate_filename = clause_name+'_'+nature+'_'+'moderate.html'
    const complex_filename = clause_name+'_'+nature+'_'+'complex.html'
    let query ='INSERT into public_clause_alternates (`clause_id`,`rationale`, `nature`,`explaination`,`simple`,`moderate`,`complex`,`status`) VALUES (?,?,?,?,?,?,?,?)';
    db.query(query, [clause_id,rationale,nature,explaination,simple_filename,moderate_filename,complex_filename, status],((err,result)=>{
       if(err){
           next(err)
       }else{  
        const Write_in_S3 =async()=>{
          await PutObject(`assets/clauses/${simple_filename}`,simple)
          await PutObject(`assets/clauses/${moderate_filename}`,moderate)
          await PutObject(`assets/clauses/${complex_filename}`,complex)
        }
        Write_in_S3().then(()=>{
              response_data.data = ''
              response_data.status = true
              response_data.message = 'Clause alternate added sucessfully'
              res.json(response_data)
        })
        // const filename = clause_name+'_'+result.insertId+'.html'
        // const paths = join(currentDir, '..', '..', 'assets', 'clauses', filename);
        // const updateQuery = 'UPDATE public_clause_alternates SET file_name = ? WHERE id = ?';
        //   db.query(updateQuery,[filename,result.insertId],((err,result)=>{
        //     if(err){
        //       next(err)
        //     }else{
        //       writeFileSync(paths, clause, 'utf8');
        //       response_data.data = ''
        //       response_data.status = true
        //       response_data.message = 'Clause alternate added sucessfully'
        //       res.json(response_data)
        //     }
        //   }))
   
       }
   }))
}
export const Switch_Clause_alternate = async(req,res,next)=>{
  const status = req.body.status
  const id = req.body.id
  const query = 'Update public_clause_alternates SET status = ? WHERE id = ?'
  db.query(query,[status,id],(err,result)=>{
    if(err){
      next(err)
    }else{
      response_data.access_token = ''
      response_data.data = []
      response_data.status = true
      response_data.message = 'clause alternate status changed successfully'
      res.json(response_data)
    }
  })
}

export const Delete_Clause_alternate = async(req,res,next)=>{
  const id = req.query.id
  const query = 'Delete FROM public_clause_alternates WHERE id = ?'
  db.query(query,[id],(err,result)=>{
    if(err){
      next(err)
    }else{
      response_data.access_token = ''
      response_data.data = []
      response_data.status = true
      response_data.message = 'clause alternate deleted successfully'
      res.json(response_data)
    }
  })
}
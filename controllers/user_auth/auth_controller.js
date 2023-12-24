import db from '../../config/database.js'
import {response_data} from '../../config/config.js'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
 const app = express()

 app.use(express.urlencoded({ extended: false }));
 app.use(express.json())

export const Login_Via_Google = async(req,res)=>{
  //hashing password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashed_password = bcrypt.hashSync(req.body.password, salt);
  // creating token
    const payload = {
      username:req.body.username,
      password:req.body.password
    }
    const access_token  = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
    let query =''
    query = 'SELECT * FROM users WHERE username = ? AND email = ?'
    db.query(query,[req.body.username,req.body.email],(err,result)=>{
      if(err){
        res.json(err)
      }else{
        if(result.length>0){
          let Data ={
            id :result[0].id,
            role_id:result[0].role_id,
            username:result[0].username,
            email:result[0].email,
            status:result[0].status
          }
          response_data.message='Welcome'+' '+req.body.username
          response_data.status=true
          response_data.access_token = access_token
          response_data.data = Data
          res.json(response_data)
        }else{
            query = 'INSERT into users (`username`,`email`,`password`,`email_verified`) VALUES (?,?,?,?)'
            db.query(query,[req.body.username,req.body.email,hashed_password,req.body.email_verified],(err,result)=>{
              if(err){
                res.json(err)
              }else{
                if(result.affectedRows>0){
                  response_data.message='Signup Successful'
                  response_data.status=true
                  response_data.access_token = access_token
                  res.json(response_data)
                }
           
              }
            })

        }
      }
    })
      // res.json(req.body.username)
}

 export const Register_New_User = async(req,res)=>{
  //hashing password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashed_password = bcrypt.hashSync(req.body.password, salt);
   // creating token
   const payload = {
    username:req.body.username,
    password:req.body.password
  }
  const access_token  = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
  let query =''
  query = 'SELECT * FROM users WHERE username = ? OR email = ?'
  db.query(query,[req.body.username,req.body.username],(err,result)=>{
    if(err){
      res.json(err)
    }else{
      if(result.length>0){
        response_data.message='User already exists'
        response_data.status=false
        res.json(response_data)
      }else{
        if(req.body.username.includes('@') == true){
          query = 'INSERT into users (`email`,`password`) VALUES (?,?)'
          db.query(query,[req.body.username,hashed_password],(err,result)=>{
            if(err){
              res.json(err)
            }else{
              if(result.affectedRows>0){
                response_data.data =[]
                response_data.message='Signup Successful'
                response_data.status=true
                response_data.access_token=access_token
                res.json(response_data)
              }
         
            }
          })
          }else{
            query = 'INSERT into users (`username`,`password`) VALUES (?,?) '
            db.query(query,[req.body.username,hashed_password],(err,result)=>{
              if(err){
                res.json(err)
              }else{
                if(result.affectedRows>0){
                  response_data.data = []
                  response_data.message='Signup Successful'
                  response_data.status=true
                  response_data.access_token=access_token
                  res.json(response_data)
                }
              }
            })
          }
      }
    }
  })
 }

 export const Update_Phone_number =async(req,res)=>{
  const query = 'UPDATE users SET phone_number = ? WHERE id = ?';
  db.query(query,[req.body.phone_number,req.body.id],(err,result)=>{
    if(err){
      res.json(err)
    }else{
      res.json(result)
    }
  })
 }

 export const Update_Email =async(req,res)=>{
  const query = 'UPDATE users SET gmail = ? WHERE id = ?';
  db.query(query,[req.body.gmail,req.body.id],(err,result)=>{
    if(err){
      res.json(err)
    }else{
      res.json(result)
    }
  })
 }

 export const Login_User = async (req,res)=>{
    // creating token
    const payload = {
      username:req.body.username,
      password:req.body.password
    }
  const access_token  = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
  const q = 'SELECT * FROM users WHERE username = ? OR email = ?'
   db.query(q,[req.body.username,req.body.username],(err,result)=>{
    if(err){
      res.json(err)
    }else{
      if(result.length>0){
        const pass = bcrypt.compareSync(req.body.password, result[0].password)
        if(pass == true){
          response_data.status = true
          response_data.data = result[0]
          response_data.message = "Welcome"+' '+ req.body.username
          response_data.access_token=access_token
         res.json(response_data)
        }else{
            response_data.message='username or passward is not valid'
            response_data.data = []
            response_data.status = false
            response_data.access_token=access_token
            res.json(response_data)
        }
      }else{
        response_data.message='username or email not found'
        response_data.data = []
        response_data.status = false
      res.json(response_data)
      }

    }
  })
 }

 export const Non_userAccess= async(req,res,next)=>{
  var clientIPaddr = null,
  clientProxy = null;
  if (req.headers['via']) { // yes
    clientIPaddr = req.headers['x-forwarded-for'];
    clientProxy = req.headers['via'];
} else { // no
    clientIPaddr = req.connection.remoteAddress;
    clientProxy = "none";
}
let payload = {
  username :''
}
if(clientIPaddr == '::1'){
  payload = {
    username :'127.0.0.1'
  }
}else{
  payload = {
    username :clientIPaddr
  }
}
const access_token  = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
response_data.access_token = access_token
response_data.message = 'access granted'
response_data.status = 0

res.json(response_data)
}
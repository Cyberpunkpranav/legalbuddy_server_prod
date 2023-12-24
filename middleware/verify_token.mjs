import { response_data } from "../config/config.js"
import jwt from 'jsonwebtoken'

export default function VerifyToken (token,req,res) {

    if (!token) {
        response_data.data = []
        response_data.status =false
        response_data.message = 'Unauthorized: No token provided' 
         res.status(401).json(response_data);
    }

    jwt.verify(token.replace('Bearer ', ''), process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            response_data.data = []
            response_data.status =false
            response_data.message = 'Unauthorized: Invalid token'
             res.status(401).json(response_data);
        }
        req.user = decoded;
    });
};
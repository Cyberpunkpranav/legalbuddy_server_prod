import { error_response } from "../config/config.js";

 export default function Error_handler (err, req, res, next) {
    error_response.data  = err.name
    error_response.message = err.message
    error_response.status = 'false'
    res.json(error_response) 
}   
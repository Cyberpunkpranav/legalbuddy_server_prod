import { GetObjectCommand,PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {error_response} from '../config/config.js'
const s3Client =new S3Client({
    region:'ap-south-1',
    credentials:{
        accessKeyId:process.env.S3_CLIENT_ACCESS_KEY_ID,
        secretAccessKey:process.env.S3_CLIENT_SECRET_KEY_ID
    }
});

async function GetObjects (key){
    const command = new GetObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key:key,
    })
    const PreSignedUrl = await getSignedUrl(s3Client,command)
    return PreSignedUrl
}
export {GetObjects}

async function PutObject (key,data){
    const Getcommand = new GetObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key:key,
    })  
    const Putcommand = new PutObjectCommand({
        Bucket:process.env.BUCKET_NAME,
        Key:key,
        Body:data
    })
    try {
        const res =  await s3Client.send(Getcommand);
        console.log('response',res.Body.statusCode);
    } catch (error) {
        if(error.Code = 'NoSuchKey'){
            const res =  await s3Client.send(Putcommand);
            return res
        }
    }
}
export {PutObject}
import multer from "multer"
var imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
      callback(null,'./assets/blog_images')
    },
    filename:(req,file,callback)=>{
      callback(null,`image-${Date.now()}${file.originalname}`)
    }
})
var isImage = (req,file,callback)=>{
  if(file.mimetype.startsWith('image')){
    callback(null,true)
  }else{
    callback(null,Error('Only image is allowed to upload'))
  }
}
var upload = multer({
    storage:imgconfig,
    fileFilter:isImage
  })
  export default upload
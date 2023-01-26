import multer from "multer"
import path from "path"

const config = multer.diskStorage({
    destination(req, file, callback) {
        const destiny = path.join(__dirname,"./../../docs")
        
        callback(null, destiny)
    },
    filename(req, file, callback) {
        callback(null, file.filename+Date.now())
    },
})

export const upload = multer({
    storage:config,

    // fileFilter:(req, file, cb)=>{
    //     req.body.image=file.originalname
    //     let ext = [".pdf"]
    //     if (ext.some(extencion => path.extname(file.originalname)==extencion)) {
    //         cb(null,true)
    //     } else {
    //         cb(null,false)
    //     }
    // }

})

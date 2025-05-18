//Multer middleware for uploading a single file
import multer from 'multer'

const storage = multer.diskStorage({
  destination:'./src/uploads',
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})

export const upload = multer({
  storage:storage
})

//Multer middle ware for uploading multiple files
//import multer from 'multer'
//
//const storage = multer.diskStorage({
//  destination:'./uploads',
//  filename: function (req, file, cb) {
//    cb(null,file.originalname)
//  }
//})
//
//export const upload = multer({
//  storage:storage
//})
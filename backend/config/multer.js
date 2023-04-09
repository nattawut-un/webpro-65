import multer from 'multer'
import path from 'path'

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './static/uploads')
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

export default upload

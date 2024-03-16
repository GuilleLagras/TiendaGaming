 import multer from "multer";
import __dirname from "../config/utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'profile'){
        return cb(null, `${__dirname}/public/docs/profile`)
      }else  if (file.fieldname === 'thumbnails') {
        return cb(null, `${__dirname}/public/docs/products`);
      }else {
        return cb (null, `${__dirname}/docs/documents`)
      }
    },

    filename: function (req, file, cb) {
      const originalname = file.originalname;
      const extension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2); 
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
  })
  
const upload = multer({ storage: storage })

export default upload

const router = require('express').Router();
const {register,login , upload} = require('../controllers/user.controller');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });


router.post('/register',register);
router.post('/login',login);
router.post('/upload',uploadMiddleware.single('file'),upload)

router.get('/hello',function(req,res){
    res.json({message:"hello from digital domi"})
})

module.exports = router;
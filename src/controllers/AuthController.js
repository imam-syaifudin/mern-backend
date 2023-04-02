const { body, validationResult } = require('express-validator');

exports.register = [ 
    body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 8 }).withMessage('Password harus mempunyai panjang minimal 8 Character'),
    (req,res,next) => {
        
    const errors = validationResult(req);
    if ( !errors.isEmpty() ){
        res.status(422).json({
            message: 'Register Gagal',
            errors: errors.array()
        })
    }


    const nama = req.body.nama;
    const email = req.body.email;
    const password = req.body.password;

    const result = {
        message: 'Register Success',
        data: {
            'uid': 1,
            'nama': nama,
            'email': email,
        }
    }

    res.status(201).json(result);


}]
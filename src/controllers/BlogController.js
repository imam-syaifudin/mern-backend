const { body, validationResult, check } = require('express-validator');
const Blog = require('../models/Blog');
const path = require('path');
const storage = require('../utils/storage');

exports.index = async (req, res, next) => {

    const optionsPaginate = {
        page: req.query.page,
        limit: req.query.limit,
    }

    Blog.paginate({}, optionsPaginate, function (error, data) {
        if (error) {
            res.status(422).json({
                message: 'Data gagal diambil',
                error: error,
            })
        } else {
            res.status(200).json({
                message: 'Data berhasil diambil',
                data: data,
            })
        }
    });


}

exports.show = async (req, res) => {

    const { id } = req.params;

    try {

        const data = await Blog.findById(id);
        res.status(200).json({
            message: 'Data berhasil ditemukan',
            data: data
        })

    } catch (error) {
        res.status(422).json({
            message: 'Data gagal ditemukan',
            error: error
        })
    }

}

exports.store = [
    body('title').isLength({ min: 5 }).withMessage('Minimal 5 Character')
        .custom((value) => {
            return Blog.findOne({ title: value }).then((blog) => {
                if (blog) {
                    return Promise.reject('Judul telah digunakan, Silahkan mengganti ke judul lain');
                }
            });
        }),
    body('image').custom((value, { req, res }) => {

        if (!req.file) {
            throw new Error('Harus ada gambar yang diupload');
        }

        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExtension = path.extname(req.file.originalname);

        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            throw new Error('File must be a JPG, JPEG, or PNG');
        }

        return true;
    }),
    body('isi').isLength({ min: 20 }).withMessage('Minimal 20 Character'),
    async (req, res, next) => {

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            if (req.file) {
                await storage.remove(req.file.path);
            }

            return res.status(422).json({
                message: 'Create Blog Gagal',
                errors: errors.array()
            });
        }


        const title = req.body.title;
        const isi = req.body.isi;
        const image = await storage.check(req.file, 'images/blog-images/');


        const newBlog = new Blog({
            title: title,
            image: image,
            isi: isi,
            author: {
                uid: 1,
                nama: "Muhammad Imam Syaifudin"
            }
        });

        newBlog.save()
            .then(result => {
                res.status(201).json({
                    message: 'Create Blog Berhasil',
                    data: result
                });
            })
            .catch(error => {
                res.status(422).json({
                    message: 'Create Blog Gagal',
                    error: error,
                });
            })
    }]

exports.update = [
    body('title').isLength({ min: 5 }).withMessage('Minimal 5 Character')
        .custom((value, { req }) => {
            return Blog.findOne({ title: value })
                .then(async (blog) => {
                    if (blog) {
                        const blog = await Blog.findById(req.params.id);
                        return blog.title == value ? Promise.resolve() : Promise.reject('Judul telah digunakan, Silahkan mengganti ke judul lain');
                    }
                });
        }),
    body('image').custom((value, { req, res }) => {

        if (req.file) {
            const allowedExtensions = ['.jpg', '.jpeg', '.png'];
            const fileExtension = path.extname(req.file.originalname);

            if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
                throw new Error('File must be a JPG, JPEG, or PNG');
            }
        }

        return true;
    }),
    body('isi').isLength({ min: 20 }).withMessage('Minimal 20 Character'),
    async (req, res) => {

        // Get Id From params
        const { id } = req.params;

        // Validation Check
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            if (req.file) {
                await storage.remove(req.file.path);
            }

            return res.status(422).json({
                message: 'Create Blog Gagal',
                errors: errors.array()
            });
        }

        try {

            const blog = await Blog.findById(id);

            const title = req.body.title;
            const isi = req.body.isi;
            let image;

            // Check jika ada gambar yang diupload
            if (!req.file) {
                image = blog.image;
            } else {
                await storage.remove(blog.image);
                image = await storage.check(req.file, 'images/blog-images/');
            }

            const newBlog = {
                title: title,
                image: image,
                isi: isi,
            }

            // Update Query
            Blog.findByIdAndUpdate(id, newBlog, { new: true })
                .then((result) => {
                    res.status(200).json({
                        message: 'Data berhasil diupdate',
                        data: result
                    })
                })
                .catch(error => {
                    res.status(422).json({
                        message: 'Data gagal diupdate',
                        error: error
                    })
                })

        } catch (error) {
            res.status(422).json({
                message: 'Data gagal ditemukan',
                error: 'Periksa identifier'
            })
        }


    }]

exports.destroy = (req, res) => {

    const { id } = req.params;

    try {

        Blog.findByIdAndDelete(id)
            .then(result => {
                storage.remove(result.image);
                res.status(200).json({
                    message: 'Delete data success',
                })
            })
            .catch(error => {
                res.status(422).json({
                    message: 'Delete data error',
                    error: error
                })
            })

    } catch (error) {
        res.status(404).json({
            message: 'Data Not Found',
            error: error
        })
    }

}
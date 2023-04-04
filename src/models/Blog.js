const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate-v2');


const Blog = Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isi: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

Blog.plugin(paginate);

module.exports = mongoose.model('blog', Blog);
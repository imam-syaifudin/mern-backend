const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Express Init
const app = express();
const port = 8000;

// Configuration
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(bodyParser.json());

// Import Routes
const AuthRoutes = require('./src/routes/AuthRoutes');
const BlogRoutes = require('./src/routes/BlogRoutes');


// Routes
app.use('/v1/auth', AuthRoutes);
app.use('/v1/blog', BlogRoutes);


// Connection Server & Database ( MongoDB )
mongoose
    .connect('mongodb://localhost:27017/mern_stack', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port : ${port}`);
        });
    })
    .catch((error) => console.log(error));




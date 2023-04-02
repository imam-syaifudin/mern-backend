const fs = require('fs');

const moveFile = (source, destination) => {
    fs.rename(source, destination, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

const check = (file, path) => {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                // jika folder tidak ada

                // Create Folder
                fs.mkdirSync(`./${path}`, { recursive: true });

                // Moving File From Folder ./images
                moveFile(file.path, `./${path}${file.filename}`)
                resolve(`${path}${file.filename}`)
            } else {
                // jika folder ada
                // Moving File From Folder ./images
                moveFile(file.path, `./${path}${file.filename}`)
                resolve(`${path}${file.filename}`)
            }
        });
    })
}

const remove = (path) => {
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}



module.exports = { check, remove };
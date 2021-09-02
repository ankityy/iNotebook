const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/iNOtebookDB';

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("mongo connected successfully");
    })
}


module.exports = connectToMongo;
'use strict';
require('dotenv').config();
const routes = require('./routes');
const bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var app = express();
function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
}

function initialize() {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());


    Object.keys(routes).forEach((key) => {
        app.use(`/api/${key}`, routes[key]);
    });

    return app;
}


module.exports = {
    initialize,
    connectMongoose
};

'use strict';
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
require('dotenv').config();
const app  = express();

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
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With,content-type, authorization, stripe-signature');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    Object.keys(routes).forEach((key) => {
        app.use(`/api/${key}`, routes[key]);
    });

    return app;
}


module.exports = {
    initialize,
    connectMongoose
};

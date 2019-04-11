"use strict";
exports.__esModule = true;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var chalk = require('chalk');
var log = console.log;
var url = 'mongodb://localhost:27017';
// Database Name
var dbName = 'survey360';
var db;
// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    db.createCollection("user", function (err, res) {
        if (err)
            throw err;
    });
    //client.close();
});
var MongoDBHandler = /** @class */ (function () {
    function MongoDBHandler() {
    }
    MongoDBHandler.prototype.listOneUser = function (threshold) {
        return new Promise(function (resolve, reject) {
            db.collection("user").findOne(function (err, results) {
                if (err) {
                    reject(err);
                }
                return resolve(results);
            });
        });
    };
    MongoDBHandler.prototype.listAllUsers = function (threshold) {
        return new Promise(function (resolve, reject) {
            db.collection("user").find({}).toArray(function (err, results) {
                if (err) {
                    reject(err);
                }
                return resolve(results);
            });
        });
    };
    MongoDBHandler.prototype.insertUser = function (user) {
        return new Promise(function (resolve, reject) {
            db.collection("user").insertOne(user)
                .then(function (results) {
                log(chalk.green("Mongo Write Success"));
                resolve(true);
            })["catch"](function (err) {
                log(chalk.red("Mongo Write Failed"));
                reject(err);
            });
        });
    };
    return MongoDBHandler;
}());
exports.MongoDBHandler = MongoDBHandler;

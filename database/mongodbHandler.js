"use strict";
exports.__esModule = true;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var chalk = require('chalk');
var log = console.log;
var error = chalk.bold.red;
var info = chalk.cyan;
var url = 'mongodb://localhost:27017';
var ObjectID = require('mongodb').ObjectID;
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
                    log(error("Mongo listAllUsers Failed"));
                    reject(err);
                }
                log(info("Mongo listAllUsers Success: Count = " + results.length));
                return resolve(results);
            });
        });
    };
    MongoDBHandler.prototype.deleteUser = function (userId) {
        return new Promise(function (resolve, reject) {
            try {
                var _id = new ObjectID(userId);
                var result = db.collection("user").deleteOne({ "_id": _id });
                result.then(function (obj) {
                    log(info("Mongo deleteUser Success: " + obj));
                    resolve(true);
                })["catch"](function (err) {
                    log(error("Mongo deleteUser - [" + userId + "] Failed: " + err));
                    reject(err);
                });
            }
            catch (err) {
                log(error("Mongo deleteUser - [" + userId + "] Failed: " + err));
                reject(err);
            }
        });
    };
    MongoDBHandler.prototype.insertUser = function (user) {
        return new Promise(function (resolve, reject) {
            db.collection("user").insertOne(user)
                .then(function (results) {
                log(info("Mongo insertUser Success"));
                resolve(true);
            })["catch"](function (err) {
                log(error("Mongo insertUser Failed"));
                reject(err);
            });
        });
    };
    return MongoDBHandler;
}());
exports.MongoDBHandler = MongoDBHandler;

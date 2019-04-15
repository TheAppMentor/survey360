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
    db.createCollection("question", function (err, res) {
        if (err)
            throw err;
    });
    db.createCollection("survey", function (err, res) {
        if (err)
            throw err;
    });
    //client.close();
});
var MongoDBHandler = /** @class */ (function () {
    function MongoDBHandler() {
    }
    MongoDBHandler.prototype.getUser = function (userId) {
        return new Promise(function (resolve, reject) {
            log(info("Mongo getUser for: " + userId));
            db.collection("user").findOne({ "_id": userId }).then(function (user) {
                log(info("Mongo gotUser: " + user.name));
                resolve(user);
            });
        });
    };
    MongoDBHandler.prototype.getAllUsers = function (threshold) {
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
                var result = db.collection("user").deleteOne({ "_id": userId });
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
    MongoDBHandler.prototype.getQuestion = function (questionId) {
        return new Promise(function (resolve, reject) {
            var _id = new ObjectID(questionId);
            log(info("Mongo getQuestion for: " + questionId));
            db.collection("question").findOne({ "_id": _id }).then(function (question) {
                log(info("Mongo gotQuestion: " + question.text));
                resolve(question);
            });
        });
    };
    MongoDBHandler.prototype.getAllQuestions = function (threshold) {
        return new Promise(function (resolve, reject) {
            db.collection("question").find({}).toArray(function (err, results) {
                if (err) {
                    log(error("Mongo getAllQuestions Failed"));
                    reject(err);
                }
                log(info("Mongo getAllQuestions Success: Count = " + results.length));
                return resolve(results);
            });
        });
    };
    MongoDBHandler.prototype.deleteQuestion = function (questionId) {
        return new Promise(function (resolve, reject) {
            try {
                var _id = new ObjectID(questionId);
                var result = db.collection("question").deleteOne({ "_id": _id });
                result.then(function (obj) {
                    log(info("Mongo deleteQuestion Success: " + obj));
                    resolve(true);
                })["catch"](function (err) {
                    log(error("Mongo deleteQuestion - [" + questionId + "] Failed: " + err));
                    reject(err);
                });
            }
            catch (err) {
                log(error("Mongo deleteQuestion - [" + questionId + "] Failed: " + err));
                reject(err);
            }
        });
    };
    MongoDBHandler.prototype.insertQuestion = function (question) {
        return new Promise(function (resolve, reject) {
            db.collection("question").insertOne(question)
                .then(function (results) {
                log(info("Mongo insertQuestion Success"));
                resolve(true);
            })["catch"](function (err) {
                log(error("Mongo insertQuestion Failed"));
                reject(err);
            });
        });
    };
    MongoDBHandler.prototype.insertSurvey = function (survey) {
        return new Promise(function (resolve, reject) {
            db.collection("survey").insertOne(survey)
                .then(function (results) {
                log(info("Mongo insertSurvey Success: " + results));
                resolve(true);
            })["catch"](function (err) {
                log(error("Mongo insertSurvey Failed"));
                reject(err);
            });
        });
    };
    MongoDBHandler.prototype.getSurvey = function (surveyId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _id = new ObjectID(surveyId);
            var result = db.collection("survey").findOne({ "_id": _id });
            result.then(function (survey) {
                log(info("Mongo getSurvey " + surveyId + ": " + survey.name));
                var participants = [];
                var questions = [];
                var allPromises = [];
                var createdByUserPromise = _this.getUser(survey.createdBy).then(function (createdByUser) {
                    survey.createdBy = createdByUser;
                });
                allPromises.push(createdByUserPromise);
                survey.participants.forEach(function (participantId) {
                    var getUserPromise = _this.getUser(participantId).then(function (participant) {
                        participants.push(participant);
                    });
                    allPromises.push(getUserPromise);
                });
                survey.questions.forEach(function (questionId) {
                    var getQuestionPromise = _this.getQuestion(questionId).then(function (question) {
                        questions.push(question);
                    });
                    allPromises.push(getQuestionPromise);
                });
                Promise.all(allPromises).then(function () {
                    survey.participants = participants;
                    survey.questions = questions;
                    resolve(survey);
                });
            });
        });
    };
    MongoDBHandler.prototype.getAllSurveys = function (threshold) {
        return new Promise(function (resolve, reject) {
            db.collection("survey").find({}).toArray(function (err, results) {
                if (err) {
                    log(error("Mongo getAllSurveys Failed"));
                    reject(err);
                }
                log(info("Mongo getAllSurveys Success: Count = " + results.length));
                return resolve(results);
            });
        });
    };
    MongoDBHandler.prototype.deleteSurvey = function (surveyId) {
        return new Promise(function (resolve, reject) {
            try {
                var _id = new ObjectID(surveyId);
                var result = db.collection("survey").deleteOne({ "_id": _id });
                result.then(function (obj) {
                    log(info("Mongo deleteSurvey Success: " + obj));
                    resolve(true);
                })["catch"](function (err) {
                    log(error("Mongo deleteSurvey - [" + surveyId + "] Failed: " + err));
                    reject(err);
                });
            }
            catch (err) {
                log(error("Mongo deleteQuestion - [" + surveyId + "] Failed: " + err));
                reject(err);
            }
        });
    };
    return MongoDBHandler;
}());
exports.MongoDBHandler = MongoDBHandler;

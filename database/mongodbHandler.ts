var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); 

const chalk = require('chalk'); 
const log = console.log;
const error = chalk.bold.red;
const info = chalk.cyan;

const url = 'mongodb://localhost:27017';
var ObjectID = require('mongodb').ObjectID;
 
// Database Name
const dbName = 'survey360';
var db; 

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db = client.db(dbName);

    db.createCollection("user", function(err, res) {
        if (err) throw err;
    });

    db.createCollection("question", function(err, res) {
        if (err) throw err;
    });

    db.createCollection("survey", function(err, res) {
        if (err) throw err;
    });

    //client.close();
});


export class MongoDBHandler {
        
    getUser(userId : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            log(info("Mongo getUser for: "+userId));
            db.collection("user").findOne({ "_id": userId}).then((user) => {
                log(info("Mongo gotUser: "+user.name));
                resolve(user);
            });
        });
    } 

    getAllUsers(threshold : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            db.collection("user").find({}).toArray((err, results) => {
                if (err) { 
                    log(error("Mongo listAllUsers Failed"));
                    reject(err); 
                }
                log(info("Mongo listAllUsers Success: Count = "+results.length));
                return resolve(results);
            });
        });
    }

    deleteUser(userId : string) : Promise<any>{
        return new Promise((resolve,reject) => {
            try {
                const result = db.collection("user").deleteOne({ "_id": userId});
                result.then((obj) => {
                    log(info("Mongo deleteUser Success: "+obj));
                    resolve(true);
                }).catch((err) => {
                    log(error("Mongo deleteUser - ["+userId+"] Failed: "+err));
                    reject(err); 
                });
            } catch (err) {
                log(error("Mongo deleteUser - ["+userId+"] Failed: "+err));
                reject(err);
            }
        });
    } 
    
    insertUser(user : any) : Promise<boolean> {
        return new Promise((resolve,reject) => {
            db.collection("user").insertOne(user)
                .then((results) => {
                    log(info("Mongo insertUser Success"));
                    resolve(true) 
                }).catch((err) => {
                    log(error("Mongo insertUser Failed"));
                    reject(err) 
                })
        })
    }

    getQuestion(questionId : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            const _id = new ObjectID(questionId);
            log(info("Mongo getQuestion for: "+questionId));
            db.collection("question").findOne({ "_id": _id}).then((question) => {
                log(info("Mongo gotQuestion: "+question.text));
                resolve(question);
            });
        });
    } 

    getAllQuestions(threshold : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            db.collection("question").find({}).toArray((err, results) => {
                if (err) { 
                    log(error("Mongo getAllQuestions Failed"));
                    reject(err); 
                }
                log(info("Mongo getAllQuestions Success: Count = "+results.length));
                return resolve(results);
            });
        });
    }

    deleteQuestion(questionId : string) : Promise<any>{
        return new Promise((resolve,reject) => {
            try {
                const _id = new ObjectID(questionId);
                const result = db.collection("question").deleteOne({ "_id": _id});
                result.then((obj) => {
                    log(info("Mongo deleteQuestion Success: "+obj));
                    resolve(true);
                }).catch((err) => {
                    log(error("Mongo deleteQuestion - ["+questionId+"] Failed: "+err));
                    reject(err); 
                });
            } catch (err) {
                log(error("Mongo deleteQuestion - ["+questionId+"] Failed: "+err));
                reject(err);
            }
        });
    } 
    
    insertQuestion(question : any) : Promise<boolean> {
        return new Promise((resolve,reject) => {
            db.collection("question").insertOne(question)
                .then((results) => {
                    log(info("Mongo insertQuestion Success"));
                    resolve(true) 
                }).catch((err) => {
                    log(error("Mongo insertQuestion Failed"));
                    reject(err) 
                })
        })
    }

    insertSurvey(survey : any) : Promise<boolean> {
        return new Promise((resolve,reject) => {
            db.collection("survey").insertOne(survey)
                .then((results) => {
                    log(info("Mongo insertSurvey Success: " + results));
                    resolve(true) 
                }).catch((err) => {
                    log(error("Mongo insertSurvey Failed"));
                    reject(err) 
                })
        })
    }

    getSurvey(surveyId : string) : Promise<any>{
        return new Promise((resolve,reject) => {
            const _id = new ObjectID(surveyId);
            const result = db.collection("survey").findOne({ "_id": _id});
            result.then((survey) => {
                log(info("Mongo getSurvey "+surveyId+": "+survey.name));
                let participants = [];
                let questions = [];
                let allPromises = [];
                const createdByUserPromise = this.getUser(survey.createdBy).then((createdByUser) => {
                    survey.createdBy = createdByUser;
                });
                allPromises.push(createdByUserPromise);
                survey.participants.forEach((participantId) => {
                    const getUserPromise = this.getUser(participantId).then((participant) => {
                        participants.push(participant);
                    }); 
                    allPromises.push(getUserPromise);
                });
                survey.questions.forEach((questionId) => {
                    const getQuestionPromise = this.getQuestion(questionId).then((question) => {
                        questions.push(question);
                    });
                    allPromises.push(getQuestionPromise);
                });
                Promise.all(allPromises).then(() => {
                    survey.participants = participants;
                    survey.questions = questions;
                    resolve(survey);
                }); 
            });   
        });
    }

    getAllSurveys(threshold : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            db.collection("survey").find({}).toArray((err, results) => {
                if (err) { 
                    log(error("Mongo getAllSurveys Failed"));
                    reject(err); 
                }
                log(info("Mongo getAllSurveys Success: Count = "+results.length));
                return resolve(results);
            });
        });
    }

    deleteSurvey(surveyId : string) : Promise<any>{
        return new Promise((resolve,reject) => {
            try {
                const _id = new ObjectID(surveyId);
                const result = db.collection("survey").deleteOne({ "_id": _id});
                result.then((obj) => {
                    log(info("Mongo deleteSurvey Success: "+obj));
                    resolve(true);
                }).catch((err) => {
                    log(error("Mongo deleteSurvey - ["+surveyId+"] Failed: "+err));
                    reject(err); 
                });
            } catch (err) {
                log(error("Mongo deleteQuestion - ["+surveyId+"] Failed: "+err));
                reject(err);
            }
        });
    } 
}

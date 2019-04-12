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

    //client.close();
});


export class MongoDBHandler {
        
    getUser(threshold : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            db.collection("user").findOne(function(err, results) {
                if (err){ reject(err); }
                return resolve(results)
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
                const _id = new ObjectID(userId);
                const result = db.collection("user").deleteOne({ "_id": _id});
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
}

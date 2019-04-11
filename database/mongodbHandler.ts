var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); const chalk = require('chalk'); const log = console.log; 
const url = 'mongodb://localhost:27017';
 
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
    //client.close();
});


export class MongoDBHandler {
        
    listOneUser(threshold : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            db.collection("user").findOne(function(err, results) {
                if (err){ reject(err); }
                return resolve(results)
            });
        });
    } 

    listAllUsers(threshold : number) : Promise<any>{
        return new Promise((resolve,reject) => {
            db.collection("user").find({}).toArray((err, results) => {
                if (err){ reject(err); }
                return resolve(results)
            });
        });
    } 
    
    insertUser(user : any) : Promise<boolean> {

        return new Promise((resolve,reject) => {
            db.collection("user").insertOne(user)
                .then((results) => {
                    log(chalk.green("Mongo Write Success")) 
                    resolve(true) 
                }).catch((err) => {
                    log(chalk.red("Mongo Write Failed"))
                    reject(err) 
                })
        })
    }
}

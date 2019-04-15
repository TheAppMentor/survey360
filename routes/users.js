const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const DatabaseHandler = require('../database/MongoDBHandler').MongoDBHandler
const dbHandler = new DatabaseHandler()

/* POST */
router.post('/', jsonParser, function(req, res, next) {

	const arrayOfUsers = req.body;
	let insertUserPromises = [];
	arrayOfUsers.forEach((user) => {
		const userName = user.name;
		const emailId = user.email;
		console.log("CREATING User  : " + userName) 
		const insertUserPromise = dbHandler.insertUser({name: userName, _id : emailId})
			.then(() => {
				
			}, (err) => {
				res.status(400);
				res.json();
			});
		insertUserPromises.push(insertUserPromise);
	});
	Promise.all(insertUserPromises).then(() => {
		dbHandler.getAllUsers()
        			.then((allData) => {
           				console.log("RESOLVING WITH Results..  : " + allData)
        				res.status(201);
            			res.json(allData)
        			})
	});
});

/* GET */
router.get('/', function(req, res, next) {
    dbHandler.getAllUsers()
        .then((allData) => {
           	console.log("RESOLVING WITH Results..  : " + allData) 
            res.json(allData)
        })
});

/* PUT */
router.put('/', function(req, res, next) {
   
});

/* DELETE */
router.delete('/', function(req, res, next) {
	const arrayOfUserIds = req.body;
	let deletePromises = [];
	arrayOfUserIds.forEach((userId) => {
		let deletePromise = dbHandler.deleteUser(userId);
		deletePromises.push(deletePromise);
		console.log("DELETE User  : " + userId) 
	});
	Promise.all(deletePromises).then(() => {
		res.json("DELETED!");
	}).catch((err) => {
		res.status(400);
		res.json("ERROR!!");
	});;
});

module.exports = router;

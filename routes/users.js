const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const DatabaseHandler = require('../database/MongoDBHandler').MongoDBHandler
const dbHandler = new DatabaseHandler()

/* POST */
router.post('/createUsers', jsonParser, function(req, res, next) {

	const arrayOfUsers = req.body;
	arrayOfUsers.forEach((user) => {
		const userName = user.name;
		const emailId = user.email;
		dbHandler.insertUser({name: userName, email : emailId})
		console.log("CREATING User  : " + userName) 
	});
  	
  	dbHandler.listAllUsers()
        .then((allData) => {
           console.log("RESOLVING WITH Results..  : " + allData) 
            res.json(allData)
        })
});

/* GET */
router.get('/readUsers', function(req, res, next) {
    dbHandler.listAllUsers()
        .then((allData) => {
           	console.log("RESOLVING WITH Results..  : " + allData) 
            res.json(allData)
        })
});

/* PUT */
router.put('/updateUsers', function(req, res, next) {
   
});

/* DELETE */
router.delete('/deleteUsers', function(req, res, next) {
    
});

module.exports = router;

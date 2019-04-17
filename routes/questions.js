const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const DatabaseHandler = require('../database/mongodbHandler').MongoDBHandler
const dbHandler = new DatabaseHandler()

/* POST */
router.post('/', jsonParser, function(req, res, next) {

	const arrayOfQuestions = req.body;
	arrayOfQuestions.forEach((question) => {
		dbHandler.insertQuestion(question)
		console.log("CREATING Question  : " + question.text) 
	});
  	dbHandler.getAllQuestions()
        .then((allData) => {
           	console.log("RESOLVING WITH Results..  : " + allData);
           	res.status(201);
            res.json(allData)
        })
});

/* GET */
router.get('/', function(req, res, next) {
    dbHandler.getAllQuestions()
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
	const arrayOfQuestionIds = req.body;
	let deletePromises = [];
	arrayOfQuestionIds.forEach((questionId) => {
		let deletePromise = dbHandler.deleteQuestion(questionId);
		deletePromises.push(deletePromise);
		console.log("DELETE Question  : " + questionId) 
	});
	Promise.all(deletePromises).then(() => {
		res.json("DELETED!");
	}).catch((err) => {
		res.status(400);
		res.json("ERROR!!");
	});;
});

module.exports = router;

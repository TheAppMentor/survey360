const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const DatabaseHandler = require('../database/MongoDBHandler').MongoDBHandler
const dbHandler = new DatabaseHandler()

/* POST */
router.post('/createQuestions', jsonParser, function(req, res, next) {

	const arrayOfQuestions = req.body;
	arrayOfQuestions.forEach((question) => {
		const text = question.text;
		dbHandler.insertQuestion({name: text})
		console.log("CREATING Question  : " + text) 
	});
  	res.json(arrayOfQuestions);
});

/* GET */
router.get('/readQuestions', function(req, res, next) {
    dbHandler.getAllQuestions()
        .then((allData) => {
           	console.log("RESOLVING WITH Results..  : " + allData) 
            res.json(allData)
        })
});

/* PUT */
router.put('/updateQuestions', function(req, res, next) {
   
});

/* DELETE */
router.delete('/deleteQuestions', function(req, res, next) {
	const arrayOfQuestions = req.body;
	let deletePromises = [];
	arrayOfQuestions.forEach((question) => {
		const questionId = question._id;
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

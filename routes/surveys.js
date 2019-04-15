const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const DatabaseHandler = require('../database/MongoDBHandler').MongoDBHandler
const dbHandler = new DatabaseHandler()

/* POST */
router.post('/createSurvey', jsonParser, function(req, res, next) {

	const survey = req.body;
	dbHandler.insertSurvey(survey);
	console.log("CREATING Survey  : " + survey);
	res.status(201);
	res.json("DONE");
});

/* GET */
router.get('/', function(req, res, next) {
	const surveyId = req.query.id;
	if (surveyId) {
		dbHandler.getSurvey(surveyId)
        .then((data) => {
           	console.log("RESOLVING WITH Results..  : " + data);
            res.json(data);
        }).catch((err) => {
        	res.status(500);
        });
	} else {
		dbHandler.getAllSurveys()
        .then((allData) => {
           	console.log("RESOLVING WITH Results..  : " + allData);
            res.json(allData);
        })
	}
});

/* DELETE */
router.delete('/', function(req, res, next) {
	const surveyId = req.query.id;
	dbHandler.deleteSurvey(surveyId)
		.then((status) => {
			if (status) {
				res.json("DELETED!");
			}
			res.status(400);
		}).catch((err) => {
			res.status(500);
		});
});

module.exports = router;

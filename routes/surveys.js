const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

const DatabaseHandler = require('../database/mongodbHandler').MongoDBHandler
const dbHandler = new DatabaseHandler()

/* POST */
router.post('/', jsonParser, function(req, res, next) {

	const survey = req.body;
	console.log("CREATING Survey  : " + survey);
	dbHandler.insertSurvey(survey).then((result) => {
		if (result) {
			res.status(201);
			res.json("");

			var surveyLink = "https://survey360.cfapps.sap.hana.ondemand.com/surveys?takeSurvey=" + result._id;
			var text = "Survey name: " + result.name + "\n";
			text = text + "Created by: " + result.createdBy + "\n";
			text = text + "Take the survey: " + surveyLink


			var mailServer = require('../mail_server/mailServer');
			var mailOptions = {
  				from: 'teamsurveyforyou@gmail.com',
  				to: 'prashanth.moorthy@sap.com, reshma.raghu@sap.com',
  				subject: 'Survey360',
  				text: text
			};
			mailServer.sendMail(mailOptions);
		}
	}).catch((err) => {
		res.status(400);
	});
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
        	res.json("");
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

var express = require('express');
var router = express.Router();

var DatabaseHandler = require('../database/MongoDBHandler').MongoDBHandler
//import { DatabaseHandler } from '../database/MongoDBHandler';

const dbHandler = new DatabaseHandler()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/addUser', function(req, res, next) {
    dbHandler.insertUser({name: "Boy 1", email : "boy1@boysclub.com"})
    res.render('index', { title: 'Add User' });

});

router.get('/listUsers', function(req, res, next) {
    //res.render('index', { title: 'User List' });
    dbHandler.listAllUsers()
        .then((allData) => {
           console.log("RESOLVING WITH Results..  : " + allData) 
            res.json(allData)
        })
        :qa

});

module.exports = router;

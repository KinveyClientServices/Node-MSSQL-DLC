/*
* node-sql-dlc
* Author: Paras Wadehra
*
* A custom Data Link Connector (DLC) written in Node.js talking to a MS SQL data source.
*/

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var sql        = require('mssql');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var port = process.env.PORT || 3000;        // set our port

var config = {
    user: '<username>', // TODO: Replace <username> with the actual username of the DB user
    password: '<password>', // TODO: Replace <password> with the actual password of the DB user
    server: '<ServerName>', // TODO: Replace <ServerName> with the actual name/IPAdress of the SQL Server
    database: '<DBName>', // TODO: Replace <DBName> with the name of the database you want to connect to
    port: <port> // TODO: Replace <port> with the port you can connect to server at. In most cases this will be 1433

    // options: {
    //     encrypt: true // Use this if you're on Windows Azure
    // }
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://website/api/)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/bills')
    // get all the bills (accessed at GET http://website/api/bills)
    .get(function(req, res) {
        var connection = new sql.Connection(config, function(err) {
            // ... error checks
            var request = new sql.Request(connection); // or: var request = connection.request();
            var quer = 'SELECT * FROM bills'; // TODO: Enter your own SELECT command. Make sure the ID from the table is returned as _id
            request.query(quer, function(err, recordset) {
                // ... error checks
                res.json(recordset);
            });
        });
    });

router.route('/bills/_count')
    // get the count of the number of bills records (accessed at GET http://website/api/bills/_count)
    .get(function(req, res) {
        var connection = new sql.Connection(config, function(err) {
            // ... error checks
            var request = new sql.Request(connection); // or: var request = connection.request();
            request.query('SELECT count(1) AS count FROM bills', function(err, recordset) { // TODO: COUNT the number of records in your table
                // ... error checks
                res.send(recordset[0]); // Needs to return a single object like {"count": 3}
            });
        });
    });

router.route('/bills/:bill_id')
    // get the bill with that id (accessed at GET http://website/api/bills/:bill_id)
    .get(function(req, res) {
        var connection = new sql.Connection(config, function(err) {
            // ... error checks
            var request = new sql.Request(connection); // or: var request = connection.request();
            var quer = 'SELECT * FROM bills WHERE BillID=' + req.params.bill_id; // TODO: Enter your own SELECT command which returns a single record with a given ID
            request.query(quer, function(err, recordset) {
                // ... error checks
                res.send(recordset);
            });
        });
    });

router.route('/claims')
    // get all the claims (accessed at GET http://website/api/claims)
    .get(function(req, res) {
        var connection = new sql.Connection(config, function(err) {
            // ... error checks
            var request = new sql.Request(connection); // or: var request = connection.request();
            var quer = 'SELECT * FROM claims'; // TODO: Enter your own SELECT command. Make sure the ID from the table is returned as _id
            request.query(quer, function(err, recordset) {
                // ... error checks
                res.json(recordset);
            });
        });
    })

    // Create new Claim (accessed at POST http://website/api/claims)
    .post(function(req, res) {
        var connection = new sql.Connection(config, function(err) {
            // ... error checks
            var request = new sql.Request(connection); // or: var request = connection.request();
            var quer = 'INSERT INTO claims...'; // TODO: Enter your own INSERT statement
            request.query(quer, function(err, recordset) {
                if(err!=null)
                {
                    console.log("/claims .post error1: " + err);
                    res.send(err);
                }

                var quer2 = 'SELECT TOP 1 * FROM claims WHERE _id = @@Identity'; // TODO: Select the record just insterted into the table
                request.query(quer2, function(err2, recordset2) {
                    if(err2!=null)
                    {
                        console.log("/claims .post error2: " + err2);
                        res.send(err2);
                    }

                    res.send(recordset2[0]); // Return a single object containing the record just created.
                })
            });
        });
    });

router.route('/claims/_count')
    // get the count of the number of claims records (accessed at GET http://website/api/claims/_count)
    .get(function(req, res) {
        var connection = new sql.Connection(config, function(err) {
            // ... error checks
            var request = new sql.Request(connection); // or: var request = connection.request();
            request.query('SELECT count(1) AS count FROM Claims', function(err, recordset) { // TODO: COUNT the number of records in your table
                // ... error checks
                res.send(recordset[0]); // Needs to return a single object like {"count": 2}
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

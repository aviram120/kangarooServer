var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var util = require('util')
var url = require('url')
var client = require ('mongodb').MongoClient
var async = require('async');

var dbConnUrl = process.env.MONGODB_URI


// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//for used in Cordova client
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {
 
        res.send(200);
    }
    else {
        next();
    }
});
//routes
require("./routes/dbMysql");
require("./routes/user")(app);
require("./routes/settings")(app);
require("./routes/review")(app);
require("./routes/event")(app);
require("./routes/bookMe")(app);
require("./routes/match")(app);

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/getMysql', function (request, response) {
	connectDatabase().query('call get_all_users()', function(err, rows, fields) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			response.json({success:true, data:rows[0] });
		}); 
});


app.post('/gettest', function (request, response) {
	console.log( request.query);	
	console.log(request.body);	
	var mail = request.body.mail;
	response.json({success:true, data:mail });
});







/*****************************test - Function*****************************/
app.get('/test', function (request, response,next) {
		async.series([
			function(callback){
				// do some stuff ...
				
				var stResp;
				var query = "call get_user_by_mail_pass('rest@mail.com','123')"
				console.log('query: ' + query);
				connectDatabase().query(query, function(err, rows) {
				if (err) {
					console.log('error: ', err);
					throw err;
				}
				
				//var status = true;
				if (rows[0].length != 0) 
				{
					stResp = rows[0];
					console.log("stResp - " + stResp)
				}
				else
				{
					status = false;
					stResp = "Invalid email or password";
				}
				var stdata = JSON.stringify({user:stResp});
				var sdata = JSON.parse(stdata);

				callback(null, sdata);
				//response.json({success:status, data:stResp });
				});
				
				
			},
			function(callback){
				// do some more stuff ...
				
				var query = "call get_review_by_userId('26')";
				connectDatabase().query(query, function(err, rows) {
					if (err) {
						console.log('error: ', err);
						throw err;
					}
					console.log("results review - " + rows[0]);	
					var stdata = JSON.stringify({review:rows[0]});
					var sdata = JSON.parse(stdata);
					//var st2 = json.parse({review:rows[0]});
					callback(null,  sdata);
				});
			},
		],
		// optional callback
		function(err, results){
			// results is now equal to ['one', 'two']
			console.log("results - " + results);	
			response.json({success:true, data:results });
		});
	//console.log("getAdditionalFeatureByUserId[response] - " + stResp);		
});

app.get('/testMatch', function (request, response,next) {
	
	matchEventSitter(33);
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
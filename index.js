//add to gis

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

var util = require('util')
var url = require('url')
var client = require ('mongodb').MongoClient

var dbConnUrl = process.env.MONGODB_URI
var mysqlConnector;

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
 
//for mysql connect
var settings = {
	  host     : 'mysql1418.opentransfer.com',
	  user     : 'AAAljt4_kangaroo',
	  password : 'MuieMa123!',
	  database : 'AAAljt4_kangaroo',
      insecureAuth: true
	};
	
var settings2 = {
	  host     : 'us-cdbr-iron-east-04.cleardb.net',
	  user     : 'bc0c220fd37c24',
	  password : 'd8f813ab',
	  database : 'heroku_ef18e6aa5b82674'
	};
function connectDatabase() {
    if (!mysqlConnector) {
        mysqlConnector = mysql.createPool(settings);
		//mysqlConnector = mysql.createConnection(settings);

		//mysqlConnector.connect(function(err){
        mysqlConnector.getConnection(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return mysqlConnector;
}	

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
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {

        res.send(200);
    }
    else {
        next();
    }
});


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

/*****************************USER - Function*****************************/
app.post('/addUser', function (request, response,next) {
	
	var mail = request.body.mail;
	var password = request.body.password;
	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var userType = request.body.userType;
	
	console.log("addUser[request] - mail:" + mail + ",password:" +  password + ",firstName: " + firstName + ",lastName: " + lastName + ",userType: " + userType);
	
	var query = "call add_new_user('" + mail + "','" + password + "','" + firstName + "','" + lastName + "'," + userType + ")";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			
			console.log('rows: ' + rows.insertId);
			response.json({success:true, data:rows.insertId });
		});
	//console.log("addUser[response] - " + stResp);		
});

app.post('/update_user', function (request, response,next) {
	//add user to mongoDB
	var userId = request.body.userId;
	var userProperties = request.body.userProperties;
	var location = request.body.location;
	var stReturn;
	
	console.log("update_user[request] - userId:" + userId + ",userProperties:" +  userProperties + ",location: " + location);
	
	var userPropertiesJson = JSON.parse(userProperties);	
	connectDatabase().query('call update_user( ' + userId + ' , ' + userPropertiesJson['phone'] + ', "' + userPropertiesJson['birthDay'] + '", "' + userPropertiesJson['about'] + '")', function(err, rows, fields) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
		});  
	stReturn  = 'update_user: true. ';

	var re = /\0/g;
	var locationStr = location.toString().replace(re, "");
	var locationJson = JSON.parse(locationStr);

	for (var i = 0; i < locationJson.length; i++)
	{
		var query = 'call add_location(' + userId + ' , "' + locationJson.country[i] + '", "' + locationJson.city[i] + '", "' + locationJson.street[i] + '", ' + locationJson.radius[i] + ', ' + locationJson.x[i] +  ', ' + locationJson.y[i]  + ')' ;
		console.log("query:" + query);
		connectDatabase().query(query, function(err, rows, fields) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
		});
		stReturn  = stReturn + 'add_location in i=' + i + ' : true.';	
	}

	console.log("update_user[response]:" + stReturn);
	response.json({success:true, data:stReturn });
});

app.get('/login', function (request, response,next) {
	//get  user from mongoDB
	
	var mail = request.query.mail;
	var password = request.query.password;
	
	if (mail == null || password == null)
	{
		response.json({success:false, data:"mail or password are missing" });
		return;
	}
	console.log("login[request] - mail:" + mail + ",password:" +  password);
	
	var query = "call get_user_by_mail_pass('" + mail + "','" + password + "')"
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			var status = true;
			if (rows[0].length != 0) 
			{
				stResp = rows[0];
			}
			else
			{
				status = false;
				stResp = "Invalid email or password";
			}
			response.json({success:status, data:stResp });
		});
		
	//console.log("login[response] - " + stResp);	
});

/*****************************additional_feature - Function*****************************/
app.post('/addAdditionalFeature', function (request, response,next) {
	//add user to mongoDB
	var userId = request.body.userId;
	var value = request.body.value;
	
	console.log("addAdditionalFeature[request] - userId:" + userId + ",value:" +  value );
	
	var query = "call add_additional_feature('" + userId + "','" + value + "')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			if (rows.affectedRows == 1) 
			{
				stResp = "add:true";
			}
			else
			{
				stResp = "add:false";
			}
			
			response.json({success:true, data:stResp });
		});
	console.log("addAdditionalFeature[response] - " + stResp);		
});
app.get('/getAdditionalFeatureByUserId', function (request, response,next) {
	var userId = request.query.userId;
	
	console.log("getAdditionalFeatureByUserId[request] - userId:" + userId );
	
	var query = "call get_additional_feature_by_userId('" + userId + "')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			
			var stResp;

			response.json({success:true, data:rows[0]});
		});
	//console.log("getAdditionalFeatureByUserId[response] - " + stResp);		
});

/*****************************review - Function*****************************/
app.post('/addReview', function (request, response,next) {
	//add user to mongoDB
	var fromId = request.body.fromId;
	var toId = request.body.toId;
	var text = request.body.text;
	var stars = request.body.stars;
	
	console.log("addReview[request] - fromId:" + fromId + ",toId:" +  toId + ",text:" +  text + ",stars:" +  stars);
	var query = "call add_review('" + fromId + "','" + toId + "','" + text + "','" + stars + "')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			if (rows.affectedRows == 1) 
			{
				stResp = "add:true";
			}
			else
			{
				stResp = "add:false";
			}
			
			response.json({success:true, data:stResp });
		});
	//console.log("addReview[response] - " + stResp);		
});
app.post('/editReview', function (request, response,next) {
	//add user to mongoDB
	var reviewId = request.body.reviewId;
	var text = request.body.text;
	var stars = request.body.stars;
	
	console.log("editReview[request] - reviewId:" + reviewId + ",text:" +  text + ",stars:" +  stars );
	var query = "call edit_review('" + reviewId + "','" + text + "','" + stars + "')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			if (rows.affectedRows == 1) 
			{
				stResp = "add:true";
			}
			else
			{
				stResp = "add:false";
			}
			
			response.json({success:true, data:stResp });
		});
	//console.log("editReview[response] - " + stResp);		
});
app.get('/getReviewByUserId', function (request, response,next) {
	var userId = request.query.userId;
	
	console.log("getReviewByUserId[request] - userId:" + userId );
	var query = "call get_review_by_userId('" + userId + "')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			
			var stResp;

			response.json({success:true, data:rows[0]});
		});
	//console.log("getAdditionalFeatureByUserId[response] - " + stResp);		
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*****************************event - Function*****************************/
app.post('/addEvent', function (request, response,next) {
	var parentId = request.body.parentId;
	var sitterId = request.body.sitterId;
	var startTime = request.body.startTime;
	var endTime = request.body.endTime;
	var status = request.body.status;
	
	var car = request.body.car;
	var sign_language = request.body.sign_language;
	var special_needs = request.body.special_needs;
	var drivg_licence = request.body.drivg_licence;
	var home_work = request.body.home_work;
	
	var coocking = request.body.coocking;
	var job_type = request.body.job_type;
	var hourly_wage = request.body.hourly_wage;
	var car_wage = request.body.car_wage;
	var drivg_licence_wage = request.body.drivg_licence_wage;
	
	var special_needs_wage = request.body.special_needs_wage;
	
	
	console.log("addEvent[request] - parentId:" + parentId + ",sitterId:" +  sitterId + ",startTime:" +  startTime  + ",endTime:" +  endTime + ",status:" +  status +
	", car:" + car + ",sign_language:" +  sign_language + ",special_needs:" +  special_needs  + ",drivg_licence:" +  drivg_licence + ",home_work:" +  home_work +
	", coocking:" + coocking + ",job_type:" +  job_type + ",hourly_wage:" +  hourly_wage  + ",car_wage:" +  car_wage + ",drivg_licence_wage:" +  drivg_licence_wage +
	",special_needs_wage:" +  special_needs_wage);
	
	var query = "call add_event('" + parentId + "','" + sitterId + "','" + startTime + "','" + endTime + "','" + status + 
	"','" + car + "','" + sign_language + "','" + special_needs + "','" + drivg_licence + "','" + home_work + 
	"','" + coocking + "','" + job_type + "','" + hourly_wage + "','" + car_wage + "','" + drivg_licence_wage + 
	"','" + special_needs_wage + 	
	"')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			if (rows.affectedRows == 1) 
			{
				stResp = "add:true";
			}
			else
			{
				stResp = "add:false";
			}
			
			response.json({success:true, data:stResp });
		});
	//console.log("editReview[response] - " + stResp);		
});

app.post('/changeStatusEvent', function (request, response,next) {
	//add user to mongoDB
	var eventId = request.body.eventId;
	var status = request.body.status;
	
	//call change_status_event(1,0)
	console.log("changeStatusEvent[request] - eventId:" + eventId + ",status:" +  status );
	var query = "call change_status_event('" + eventId + "','" + status + "')";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			if (rows.affectedRows == 1) 
			{
				stResp = "add:true";
			}
			else
			{
				stResp = "add:false";
			}
			
			response.json({success:true, data:stResp });
		});
	//console.log("editReview[response] - " + stResp);		
});
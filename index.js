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

 
//for mysql connect
var settings = {
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
app.get('/test', function(request, response) {
  response.json('good11');
});

app.get('/getMysql', function (request, response) {
	connectDatabase().query('call GetAllUserd()', function(err, rows, fields) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			response.json({success:true, data:rows[0] });
		});
	
	//mysqlConnector.release(); 
});

app.post('/addUser', function (request, response,next) {
	//add user to mongoDB
	var userName = request.body.userName;
	var password = request.body.password;
	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var birthday = request.body.birthday;
	var phoneNum = request.body.phoneNum;
	var mail = request.body.mail;
	
	console.log("addUser[request] - userName:" + userName + ",password:" +  password + ",firstName: " + firstName + ",lastName: " + lastName + ",birthday: " + birthday + ",phoneNum: " + phoneNum + ", mail: " + mail);
	
	client.connect(dbConnUrl, function(err, db) {
	  if (err) throw err;

	  //simple json record
		var document = { "UserName" : userName, "Password" : password , "FirstName" : firstName , "LastName" : lastName, "Birthday" : birthday,  "PhoneNum" : phoneNum , "Mail" : mail ,"Timestamp" : new Date().getTime() };
	  
		//insert record
		db.collection('users').insert(document, function(err, records) {
			var stResp;
			try 
			{
				response.json({success:true, data:'id: ' +document._id}); 
				stResp = "id in DB: " + document._id;
			}
			catch (e) {
				response.json({success:false, data:err});	
				stResp = "ERROR: " + err;
			}
			
			console.log("addUser[response] - " + stResp);
		});
	});
});

app.get('/getUser', function (request, response,next) {
	//get  user from mongoDB
	
	var userName = request.query.userName;
	var password = request.query.password;
	
	if (userName == null || password == null)
	{
		response.json({success:false, data:"userName or password are missing" });
		return;
	}
	console.log("getUser[request] - userName:" + userName + ",password:" +  password);
	
	var query = { 'UserName' : userName, 'Password' : password  };

	client.connect(dbConnUrl, function(err, db) {
		db.collection('users', function(err, collection) {

			collection.findOne(query, function(err, item) {
				var stResp;
				if (item != null)
				{
					response.json({success:true, data:item });
					stResp = JSON.stringify(item);;
				}
				else
				{
					response.json({success:false, data:"user not found in db" });
					stResp = "user not found in db";
				}
				console.log("getUser[response] - " + stResp);
			});
		});
	});
});


app.post('/update_user', function (request, response,next) {
	//add user to mongoDB
	var userId = request.body.userId;
	var userProperties = request.body.userProperties;
	var location = request.body.location;
	
	console.log("update_user[request] - userId:" + userId + ",userProperties:" +  userProperties + ",location: " + location);
	var userPropertiesJson = JSON.parse(userProperties);
	var locationJson = JSON.parse(location);
	
	var stReturn;
	connectDatabase().query('call update_user( ' + userId + ' , ' + userPropertiesJson['phone'] + ', "' + userPropertiesJson['birthDay'] + '", "' + userPropertiesJson['about'] + '")', function(err, rows, fields) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
		});
	stReturn  = 'update_user: true ';
	
	connectDatabase().query('call add_location( ' + userId + ' , "' + locationJson['country'] + '", "' + locationJson['city'] + '", "' + locationJson['street'] +  '", ' + locationJson['radius'] +  ', ' + locationJson['x'] +  ', ' + locationJson['y'] + ')', function(err, rows, fields) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
		});
	stReturn  = stReturn + 'add_location : true';	
	
	console.log("update_user[response]:" + stReturn);
	response.json({success:true, data:stReturn });
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



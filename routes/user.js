require("./dbMysql")();

module.exports = function (app) {	

/*****************************USER - Function*****************************/
app.post('/user/addUser', function (request, response,next) {
	
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

app.post('/user/update_user', function (request, response,next) {
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

app.get('/user/login', function (request, response,next) {
	
	var mail = request.query.mail;
	var password = request.query.password;
	
	if (mail == null || password == null)
	{
		response.json({success:false, data:"mail or password are missing" });
		return;
	}
	console.log("/user/login[request] - mail:" + mail + ",password:" +  password);
	
	var query = "call get_user_by_mail_pass('" + mail + "','" + password + "')"
	//console.log('query: ' + query);
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
			//console.log("/user/login[response] - " + stResp);
			response.json({success:status, data:stResp });
		});
		
		
});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};
require("./dbMysql")();

module.exports = function (app) {	

/*****************************USER - Function*****************************/
app.post('/user/addUser', function (request, response,next) {
	
	var mail = request.body.mail;
	var password = request.body.password;
	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var userType = request.body.userType;
	
	if (mail == null || password == null || firstName == null || lastName == null || userType == null)
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	console.log("/user/addUser[request] - mail:" + mail + ",password:" +  password + ",firstName: " + firstName + ",lastName: " + lastName + ",userType: " + userType);
	
	var query = "call add_new_user('" + mail + "','" + password + "','" + firstName + "','" + lastName + "'," + userType + ")";
	console.log('query: ' + query);
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var status = true;
			var stReturn = rows[0][0].resp;
			if (stReturn == 'User exists')
			{
				status = false;
			}
			
			console.log("/user/addUser[response]:" + stReturn);
			response.json({success:status, data:stReturn });
		});
		
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
				
				 //convert the responce from db to user
				var userArray = {"user":{ "id":  stResp[0].id
				,"mail": stResp[0].mail
				,"first_name": stResp[0].first_name 
				,"last_name": stResp[0].last_name 
				,"phone_num": stResp[0].phone_num 
				,"birth_day": stResp[0].birth_day 
				,"about_as": stResp[0].about_as 
				,"baby_counter": stResp[0].baby_counter 
				,"time_created:": stResp[0].time_last_enter 
				,"user_type": stResp[0].user_type 				
				}};

				 //convert the responce from db to array event
				var eventArray ={ "evnets": [] };
				for (var i = 0; i<stResp.length; i++)
				{
					var event = { "id_event": stResp[i].id_event
					,"id_event": stResp[i].id_event
					,"parent_id": stResp[i].parent_id
					,"sitter_id": stResp[i].sitter_id
					
					,"title": stResp[i].title
					,"allDay": stResp[i].allDay
					,"message": stResp[i].message
					
					,"startTime": stResp[i].start_time
					,"endTime": stResp[i].end_time
					,"status": stResp[i].status
					,"car": stResp[i].car
					,"sign_language": stResp[i].sign_language
					,"special_needs": stResp[i].special_needs
					,"driving_licence": stResp[i].driving_licence
					,"home_work": stResp[i].home_work
					,"coocking": stResp[i].coocking
					,"job_type": stResp[i].job_type
					,"hourly_wage": stResp[i].hourly_wage
					,"car_wage": stResp[i].car_wage
					,"driving_licence_wage": stResp[i].driving_licence_wage
					,"special_needs_wage": stResp[i].special_needs_wage
					};
					eventArray.evnets[i]=event;
				}
			}
			else
			{
				status = false;
				stResp = "Invalid email or password";
			}
			//
			console.log("/user/login[response] - " + JSON.stringify([userArray,eventArray]));
			response.json({success:status, data:[userArray,eventArray] });
		});
		
		
});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};
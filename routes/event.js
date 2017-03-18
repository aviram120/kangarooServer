require("./dbMysql")();
var async = require('async');
/*****************************event - Function*****************************/
module.exports = function (app) {	


//can delete!! 
app.post('/event/addEvent', function (request, response,next) {
	
	var parentId = request.body.parentId;
	var sitterId = request.body.sitterId;
	var startTime = request.body.startTime;
	var endTime = request.body.endTime;
	
	var startTimeSt = request.body.startTimeSt;
	var endTimeSt = request.body.endTimeSt;
	
	var status = request.body.status;
	
	var car = request.body.car;
	var sign_language = request.body.sign_language;
	var special_needs = request.body.special_needs;
	var driving_licence = request.body.driving_licence;//drivg_licence
	var home_work = request.body.home_work;
	
	var coocking = request.body.coocking;
	var job_type = request.body.job_type;
	var hourly_wage = request.body.hourly_wage;
	var car_wage = request.body.car_wage;
	var driving_licence_wage = request.body.driving_licence_wage;//drivg_licence_wage
	
	var special_needs_wage = request.body.special_needs_wage;
	
	var title = request.body.title;
	var allDay = request.body.allDay;
	var message = request.body.message;

	
	
	if (parentId == null || sitterId == null || startTime == null || endTime == null || startTimeSt == null || endTimeSt == null || status == null || car == null || sign_language == null || 
	special_needs == null || driving_licence == null || home_work == null || coocking == null || job_type == null || hourly_wage == null || car_wage == null
	|| driving_licence_wage == null || special_needs_wage == null || title == null || allDay == null || message == null )
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	
	console.log("/event/addEvent[request] - parentId:" + parentId + ",sitterId:" +  sitterId + ",startTime:" + 
	startTime  + ",endTime:" +  endTime + ",startTimeSt:" + startTimeSt  +	",endTimeSt:" + endTimeSt  + ",status:" +  status +
	", car:" + car + ",sign_language:" +  sign_language + ",special_needs:" +  special_needs  + ",driving_licence:" +  driving_licence + ",home_work:" +  home_work +
	", coocking:" + coocking + ",job_type:" +  job_type + ",hourly_wage:" +  hourly_wage  + ",car_wage:" +  car_wage + ",driving_licence_wage:" +  driving_licence_wage +
	",special_needs_wage:" +  special_needs_wage  +  title + ",title:"  +  allDay + ",allDay:"  +  message + ",message:");
	
	var query = "call add_event('" + parentId + "','" + sitterId + "','" + startTime + "','" + endTime + "','" + status + 
	"','" + car + "','" + sign_language + "','" + special_needs + "','" + driving_licence + "','" + home_work + 
	"','" + coocking + "','" + job_type + "','" + hourly_wage + "','" + car_wage + "','" + driving_licence_wage + 
	"','" + special_needs_wage + "','" + title + "','" + allDay + "','" + message +  "','" + startTimeSt + "','" + endTimeSt +
	"')";
	//console.log('query: ' + query);
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
			console.log("/event/addEvent[response] - " + stResp);
			response.json({success:true, data:stResp });
		});
			
});

app.post('/event/addEventWithSrttings', function (request, response,next) {
	
	var inputJson = request.body;	
	
	console.log("/event/addEventWithSrttings[request] - inputJson:" + JSON.stringify(inputJson) );
	
	if (inputJson == null )
	{
		var msg = "one or more params is missing";
		response.json({success:false, inputJson:msg });
		return;
	}

	var eventId =-1;
		async.series([
			function(callback){
				// function one - add event to DB	
				var stResp;
					var query = "call add_event('" + inputJson.event.parentId + "','" + inputJson.event.sitterId + "','" + inputJson.event.startTime + "','" + inputJson.event.endTime + "','" + inputJson.event.status + 
					"','" + inputJson.event.car + "','" + inputJson.event.sign_language + "','" + inputJson.event.special_needs + "','" + inputJson.event.driving_licence + "','" + inputJson.event.home_work + 
					"','" + inputJson.event.coocking + "','" + inputJson.event.job_type + "','" + inputJson.event.hourly_wage + "','" + inputJson.event.car_wage + "','" + inputJson.event.driving_licence_wage + 
					"','" + inputJson.event.special_needs_wage + "','" + inputJson.event.title + "','" + inputJson.event.allDay + "','" + inputJson.event.message +  "','" + inputJson.event.startTimeSt + "','" + inputJson.event.endTimeSt +
					"')";
					
				connectDatabase().query(query, function(err, rows) {
				if (err) {
					console.log('error: ', err);
					throw err;
				}
				if (rows[0][0].resp != null) 
				{
					eventId = rows[0][0].resp;
					stResp = "add event:true,";
				}
				else
				{
					stResp = "add event:false,";
				}
				
				callback(null, stResp);
				matchEventSitter(eventId);//sent to sitter the event(this function is in "match.js")
				});	
			},
			function(callback){
				// function two - add settings to DB
				
				query = "INSERT INTO `settings`( `userId`, `eventId`, `settingId`, `value`) VALUES ";
				var querySetting = "";
				if (inputJson.settings != null)
				{
					var lengthSettings  = inputJson.settings.length;
					for (var i = 0; i < lengthSettings; i++)
					{
						var userId = inputJson.settings[i].userId;
						var eventId = inputJson.settings[i].eventId;
						var settingId = inputJson.settings[i].settingId;
						var value = inputJson.settings[i].value;
						
						querySetting = querySetting + "(" + userId + "," + eventId + "," + settingId + "," + value  + ")";
						if (i+1 != lengthSettings )
						{
							querySetting = querySetting + ",";
						}
					}
					query = query + querySetting;
				
					connectDatabase().query(query, function(err, rows) {
							if (err) {
								console.log('error: ', err);
								throw err;
							}
							var stResp;
							if (rows.affectedRows == lengthSettings) 
							{
								stResp = "add settings:true";
							}
							else
							{
								stResp = "add settings:false";
							}
							callback(null,  stResp);
						});
				}
				else
				{
					callback(null, "add settings: false, Ther is no data for add settings");
				}
			},
		],
		// optional callback
		function(err, results){
			console.log("/event/addEventWithSrttings[response]" + results);
			response.json({success:true, data:results });
			
		});	
});

app.post('/event/changeStatusEvent', function (request, response,next) {
	
	var eventId = request.body.eventId;
	var status = request.body.status;
	
	if (eventId == null || status == null )
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	console.log("/event/changeStatusEvent[request] - eventId:" + eventId + ",status:" +  status );
	var query = "call change_status_event('" + eventId + "','" + status + "')";
	//console.log('query: ' + query);
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
			console.log("/event/changeStatusEvent[response] - " + stResp);		
			response.json({success:true, data:stResp });
		});
	
});
app.get('/event/getEventByUsedId', function (request, response,next) {
	
	var userId = request.query.userId;

	
	if (userId == null)
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	console.log("/event/getEventByUsedid[request] - userId:" + userId );
	
	var query = "call get_event_by_userId('" + userId + "')"
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
				//status = true;
				stResp = "no data to this userid";
			}

			console.log("/event/getEventByUsedid[response] - " + JSON.stringify(stResp));
			response.json({success:status, data:stResp });
		});
});
app.post('/event/updateEvent', function (request, response,next) {
	console.log(request.body);
	var eventId = request.body.eventId;
	var sitterId = request.body.sitterId;
	var startTime = request.body.startTime;
	var endTime = request.body.endTime;
	
	var startTimeSt = request.body.startTimeSt;
	var endTimeSt = request.body.endTimeSt;
	
	var status = request.body.status;//***********
	var car = request.body.car;
	
	var sign_language = request.body.sign_language;
	var special_needs = request.body.special_needs;
	var driving_licence = request.body.driving_licence;//drivg_licence
	var home_work = request.body.home_work;
	var coocking = request.body.coocking;
	
	var job_type = request.body.job_type;
	var hourly_wage = request.body.hourly_wage;
	var car_wage = request.body.car_wage;
	var driving_licence_wage = request.body.driving_licence_wage;//drivg_licence_wage
	var special_needs_wage = request.body.special_needs_wage;
	
	var title = request.body.title;
	var allDay = request.body.allDay;
	var message = request.body.message;
	
	if ( eventId == null || sitterId == null || startTime == null || endTime == null || startTimeSt == null || endTimeSt == null ||  status == null || car == null || sign_language == null || 
	special_needs == null || driving_licence == null || home_work == null || coocking == null || job_type == null || hourly_wage == null || car_wage == null
	|| driving_licence_wage == null || special_needs_wage == null || title == null || allDay == null || message == null   )
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	
	console.log("/event/updateEvent[request] - eventId:" + eventId + ",sitterId:" +  sitterId + ",startTime:" +  startTime  + ",endTime:" +  endTime + 
	",startTimeSt:" +  startTimeSt + ",endTimeSt:" +  endTimeSt + ",status:" +  status +
	", car:" + car + ",sign_language:" +  sign_language + ",special_needs:" +  special_needs  + ",driving_licence:" +  driving_licence + ",home_work:" +  home_work +
	", coocking:" + coocking + ",job_type:" +  job_type + ",hourly_wage:" +  hourly_wage  + ",car_wage:" +  car_wage + ",driving_licence_wage:" +  driving_licence_wage +
	",special_needs_wage:" +  special_needs_wage);
	
	var query = "call update_event('" +  sitterId + "','" + startTime + "','" + endTime + "','" + status + 
	"','" + car + "','" + sign_language + "','" + special_needs + "','" + driving_licence + "','" + home_work + 
	"','" + coocking + "','" + job_type + "','" + hourly_wage + "','" + car_wage + "','" + driving_licence_wage + 
	"','" + special_needs_wage + "','" + eventId + "','" + title + "','" + allDay + "','" + message +  "','" + startTimeSt + "','" + endTimeSt +
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
				stResp = "update:true";
			}
			else
			{
				stResp = "update:false";
			}
			console.log("/event/updateEvent[response] - " + stResp);	
			response.json({success:true, data:stResp });
		});
	
});	
	
	
	
	
	
	
	
	
	
	
	
	
};//end page
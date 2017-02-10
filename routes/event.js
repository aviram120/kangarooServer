require("./dbMysql")();
/*****************************event - Function*****************************/
module.exports = function (app) {	

app.post('/event/addEvent', function (request, response,next) {
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
	
	if (parentId == null || sitterId == null || startTime == null || endTime == null || status == null || car == null || sign_language == null || 
	special_needs == null || drivg_licence == null || home_work == null || coocking == null || job_type == null || hourly_wage == null || car_wage == null
	|| drivg_licence_wage == null || special_needs_wage == null  )
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	
	console.log("/event/addEvent[request] - parentId:" + parentId + ",sitterId:" +  sitterId + ",startTime:" +  startTime  + ",endTime:" +  endTime + ",status:" +  status +
	", car:" + car + ",sign_language:" +  sign_language + ",special_needs:" +  special_needs  + ",drivg_licence:" +  drivg_licence + ",home_work:" +  home_work +
	", coocking:" + coocking + ",job_type:" +  job_type + ",hourly_wage:" +  hourly_wage  + ",car_wage:" +  car_wage + ",drivg_licence_wage:" +  drivg_licence_wage +
	",special_needs_wage:" +  special_needs_wage);
	
	var query = "call add_event('" + parentId + "','" + sitterId + "','" + startTime + "','" + endTime + "','" + status + 
	"','" + car + "','" + sign_language + "','" + special_needs + "','" + drivg_licence + "','" + home_work + 
	"','" + coocking + "','" + job_type + "','" + hourly_wage + "','" + car_wage + "','" + drivg_licence_wage + 
	"','" + special_needs_wage + 	
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
	
	var eventId = request.body.eventId;
	var sitterId = request.body.sitterId;
	var startTime = request.body.startTime;
	var endTime = request.body.endTime;
	var status = request.body.status;//***********
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
	
	if ( eventId == null || sitterId == null || startTime == null || endTime == null || status == null || car == null || sign_language == null || 
	special_needs == null || drivg_licence == null || home_work == null || coocking == null || job_type == null || hourly_wage == null || car_wage == null
	|| drivg_licence_wage == null || special_needs_wage == null  )
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	
	console.log("/event/updateEvent[request] - eventId:" + eventId + ",sitterId:" +  sitterId + ",startTime:" +  startTime  + ",endTime:" +  endTime + ",status:" +  status +
	", car:" + car + ",sign_language:" +  sign_language + ",special_needs:" +  special_needs  + ",drivg_licence:" +  drivg_licence + ",home_work:" +  home_work +
	", coocking:" + coocking + ",job_type:" +  job_type + ",hourly_wage:" +  hourly_wage  + ",car_wage:" +  car_wage + ",drivg_licence_wage:" +  drivg_licence_wage +
	",special_needs_wage:" +  special_needs_wage);
	
	var query = "call update_event('" +  sitterId + "','" + startTime + "','" + endTime + "','" + status + 
	"','" + car + "','" + sign_language + "','" + special_needs + "','" + drivg_licence + "','" + home_work + 
	"','" + coocking + "','" + job_type + "','" + hourly_wage + "','" + car_wage + "','" + drivg_licence_wage + 
	"','" + special_needs_wage + "','" + eventId + 
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
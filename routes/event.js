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

app.post('/event/changeStatusEvent', function (request, response,next) {
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

	
	
	
	
	
	
	
	
	
	
	
	
	
};//end page
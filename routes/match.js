require("./dbMysql")();
var async = require('async');
/*****************************match - Function*****************************/
module.exports = function (app) {	

this.matchEventSitter =  function (eventId) {
	
   console.log("matchEventSitter-function[request]. eventId:" + eventId);
   
	var queryMainSitters = "";
	var numOfSittersThatFit;
	
	async.series([ 
		function(callback){
				// function one - get all sittest 
				//TODO- make sp
				var query = "SELECT  `id` FROM  `user` WHERE  `user_type` = 2";//get all userSitter from "user"
				connectDatabase().query(query, function(err, rows) {
				if (err) {
					console.log('error: ', err);
					throw err;
				}
				
				queryMainSitters = "INSERT INTO `matchEventSitter`( `eventId`, `sitterId`) VALUES ";
				var querySitters = "";
				numOfSittersThatFit = rows.length;
				for (var i = 0; i< rows.length; i++)
				{
					querySitters = querySitters + "(" + eventId + "," + rows[i].id  + ")";
					if (i+1 != numOfSittersThatFit)
					{
						querySitters = querySitters + ",";
					}
				}
				queryMainSitters  = queryMainSitters + querySitters;
				callback(null);
				});
		},
		function(callback){
			console.log(queryMainSitters);
			// function two - insert to db (table matchEventSitter)
			connectDatabase().query(queryMainSitters, function(err, rows) {
					if (err) {
						console.log('error: ', err);
						throw err;
					}
					
					var stResp;
					if (rows.affectedRows == numOfSittersThatFit) 
					{
						stResp = "add sitters:true";
					}
					else
					{
						stResp = "add sitters:false";
					}
					//send push to all sitter
					callback(null,  stResp);	
				});	
				
			},
		],
		// optional callback
		function(err, results){
			console.log("matchEventSitter-function[response]" + results);
		});

};

app.get('/match/getAllEventsMatchBySitterId', function (request, response,next) {
		var sitterId  = request.query.sitterId;
		
		console.log("/match/getAllEventsMatchBySitterId[request] - sitterId:" + sitterId );
		
		if (sitterId == null)
		{
			response.json({success:false, data:"mail or password are missing" });
			return;
		}
	
		var stEventsIds = "";
		async.series([
		function(callback){
			// function one - get all eventId that match to sitterId
			
				var query = "call get_eventId_By_sitterId_from_match('" + sitterId + "')";
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
					
					for (var i=0; i<stResp.length; i++)
					{
						stEventsIds = stEventsIds + stResp[i].eventId
						if (i+1 != stResp.length)
						{
							stEventsIds = stEventsIds + ",";//make string with all events
						}
					}
				}
				else
				{
					status = false;
					stResp = "There isn't data for this parameters";
				}
				
				console.log("getJob funuction 1 - " + stEventsIds);
				callback(null);
			});			
		},
		function(callback){
				// function two - get all sittest
					if (stEventsIds != "")
					{
						var query = "call get_user_and_event_by_eventId('" + stEventsIds + "')";
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
							stResp = "There isn't data for this parameters";
						}
						console.log("getJob funuction 2 - " + stResp);
						callback(null,stResp);	
						});	
					}
					else//there is no event for this sitter
					{
						callback(null,"Ther is no data for this sitterId");
					}
			},
		],
		// optional callback
		function(err, results){
			console.log("/match/getAllEventsMatchBySitterId[response] - results:" + results );
			response.json({success:true, data:results[1] });
		});
});
	
	
	
	
	
	
	
	
	
};//end page
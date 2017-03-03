require("./dbMysql")();
/*****************************book_me - Function*****************************/
module.exports = function (app) {	


app.post('/bookMe/addBookMe', function (request, response,next) {
	
	var eventId	 = request.body.eventId	;
	var sitterId = request.body.sitterId;
	
	if (eventId == null || sitterId == null )
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	console.log("/bookMe/addBookMe[request] - eventId:" + eventId + ",sitterId:" +  sitterId );
	var query = "call add_book_me('" + eventId + "','" + sitterId + "')";
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
			console.log("/bookMe/addBookMe[response] - " + stResp);		
			response.json({success:true, data:stResp });
		});
	
});
app.get('/bookMe/getBookMeByEventId', function (request, response,next) {
	
	var eventId	 = request.query.eventId	;

	
	if (eventId == null)
	{
		var msg = "one or more params is missing";
		response.json({success:false, data:msg });
		return;
	}
	console.log("/bookMe/getBookMeByEventId[request] - eventId:" + eventId );
	
	var query = "call get_book_me_by_eventId('" + eventId + "')"

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
				stResp = "no data to this eventId";
			}

			console.log("/bookMe/getBookMeByEventId[response] - " + JSON.stringify(stResp));
			response.json({success:status, data:stResp });
		});
});


	
	
	
	
	
	
	
	
	
	
};//end page
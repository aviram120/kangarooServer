require("./dbMysql")();
/*****************************additionalFeature - Function*****************************/
module.exports = function (app) {	

app.post('/additionalFeature/addAdditionalFeature', function (request, response,next) {
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
app.get('/additionalFeature/getAdditionalFeatureByUserId', function (request, response,next) {
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};//end page
require("./dbMysql")();
/*****************************review - Function*****************************/
module.exports = function (app) {	


app.post('/review/addReview', function (request, response,next) {
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
app.post('/review/editReview', function (request, response,next) {
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
app.get('/review/getReviewByUserId', function (request, response,next) {
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};//end page
require("./dbMysql")();
/*****************************additionalFeature - Function*****************************/
module.exports = function (app) {	

app.post('/additionalFeature/addAdditionalFeature', function (request, response,next) {

	var tableId = request.body.tableId;
	var type = request.body.type;
	var val_ID = request.body.val_ID;
	var param = request.body.param;
	
	console.log("/additionalFeature/addAdditionalFeature[request] - tableId:" + tableId + ",type:" +  type + ",val_ID:" +  val_ID + ",param:" +  param);
	
	if (tableId == null || type == null || val_ID == null || param == null )
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	var query = "call add_additional_feature('" + tableId + "','" + type + "','" + val_ID + "','" + param +"')";
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
			console.log("/additionalFeature/addAdditionalFeature[response] - " + stResp);
			response.json({success:true, data:stResp });
		});	
});
app.get('/additionalFeature/getAdditionalFeature', function (request, response,next) {
	var tableId = request.query.tableId;
	var type = request.query.type;
	
	console.log("/additionalFeature/getAdditionalFeature[request] - tableId:" + tableId + ",type:" +  type );
	if (tableId == null || type == null )
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	var query = "call get_additional_feature('" + tableId + "','" + type +"')";
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
			console.log("/additionalFeature/getAdditionalFeature[response] - " + stResp);
			response.json({success:status, data: stResp});
		});		
});	
	
	
app.post('/additionalFeature/addNameToAdditionalFeature', function (request, response,next) {

	var val_ID = request.body.val_ID;
	var name = request.body.name;
	
	console.log("/additionalFeature/addNameToAdditionalFeature[request] - val_ID:" + val_ID + ",name:" +  name );
	
	if (val_ID == null || name == null)
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	var query = "call add_additional_field('" + val_ID + "','" + name + "')";
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
			console.log("/additionalFeature/addNameToAdditionalFeature[response] - " + stResp);
			response.json({success:true, data:stResp });
		});	
});

app.get('/additionalFeature/getAllAdditionalFeatureFields', function (request, response,next) {
	console.log("/additionalFeature/getAllAdditionalFeatureFields[request]");
	
	var query = "call get_all_additional_feature_fields()";
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
				stResp = "There isn't data in this table";
			}
			console.log("/additionalFeature/getAllAdditionalFeatureFields[response] - " + stResp);
			response.json({success:status, data: stResp});
		});		
});	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};//end page
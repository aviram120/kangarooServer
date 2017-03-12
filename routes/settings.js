require("./dbMysql")();
/*****************************Settings - Function*****************************/
module.exports = function (app) {	

app.get('/settings/get_global_settings', function (request, response,next) {
	
	
	var query = "call get_global_settings()";
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
			/*
			var stdata = JSON.stringify(stResp);
			var sdata = JSON.parse(stdata);
			var buf = Buffer.from(sdata[0].photo.data, 'base64');//base64_decode 'base64'
			sdata[0].photo = buf;*/
			
			
			
			//console.log(sdata[0].photo.data);
			console.log("/settings/get_global_settings[response] - " + stResp);
			response.json({success:status, data: stResp});
			//response.send(stResp[0].photo);
		});		
});	

app.post('/settings/addSettings', function (request, response,next) {

	var userId = request.body.userId;
	var eventId = request.body.eventId;
	var settingId = request.body.settingId;
	var value = request.body.value;
	
	console.log("/settings/addSettings[request] - userId:" +userId + ",eventId:" +  eventId + ",settingId:" +  settingId + ",value:" +  value);
	
	if (settingId == null || value == null || userId == null || eventId == null )
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	var query = "call add_settings('" + userId + "','" + eventId + "','" + settingId + "','" + value +"')";
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			console.log(rows[0][0].resp);
			var returnId = rows[0][0].resp;
			if (returnId != null) 
			{
				stResp =  returnId;
				
			}
			else
			{
				stResp = "add:false";
			}
			console.log("/settings/addSettings[response] - " + stResp);
			response.json({success:true, data:stResp });
		});	
});
app.get('/settings/get_settings_by_evenid_or_userid', function (request, response,next) {
	var usedId = request.query.usedId;
	var eventId = request.query.eventId;
	
	console.log("/settings/get_settings_by_evenid_or_userid[request] - usedId:" + usedId + ",eventId:" +  eventId );
	if (usedId == null && eventId == null )
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	if (usedId == null)
	{
		usedId=-1;
	}
	if (eventId == null)
	{
		eventId=-1;
	}
	
	var query = "call get_settings_by_evenid_or_userid('" + usedId + "','" + eventId +"')";
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
			console.log("/settings/get_settings_by_evenid_or_userid[response] - " + stResp);
			response.json({success:status, data: stResp});
		});		
});	

app.post('/settings/updateSettings', function (request, response,next) {

	var id = request.body.id;
	var value = request.body.value;
	
	console.log("/settings/updateSettings[request] - id:" +id + ",value:" +  value );
	
	if (id == null || value == null  )
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	var query = "call update_setting('" + id + "','" + value + "')";
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
			console.log("/settings/updateSettings[response] - " + stResp);
			response.json({success:true, data:stResp });
		});	
});
app.post('/settings/deleteSettings', function (request, response,next) {

	var id = request.body.id;

	
	console.log("/settings/deleteSettings[request] - id:" +id  );
	
	if (id == null   )
	{
		var errMsg = "on of the parameters is null";
		console.log(errMsg);
		response.json({success:false, data:errMsg });
		return;
	}
	
	var query = "call delete_setting('" + id + "')";
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			var stResp;
			if (rows.affectedRows == 1) 
			{
				stResp = "delete:true";
			}
			else
			{
				stResp = "delete:false";
			}
			console.log("/settings/deleteSettings[response] - " + stResp);
			response.json({success:true, data:stResp });
		});	
});




















app.post('/settings/addAdditionalFeature', function (request, response,next) {

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
app.get('/settings/getAdditionalFeature', function (request, response,next) {
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
	
	
app.post('/settings/addNameToAdditionalFeature', function (request, response,next) {

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

app.get('/settings/getAllAdditionalFeatureFields', function (request, response,next) {
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
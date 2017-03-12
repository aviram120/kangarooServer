require("./dbMysql")();
/*****************************match - Function*****************************/
module.exports = function (app) {	

this.matchEventSitter =  function (eventId) {
   console.log("matchEventSitter. eventId:" + eventId);
   	var query = "SELECT  `id` FROM  `user` WHERE  `user_type` = 2";
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			
			var pipeSitters = "";
			for (var i = 0; i< rows.length; i++)
			{
				console.log(rows[i].id);
				pipeSitters = pipeSitters + rows[i].id ;
				
				if (i+1 != rows.length)
				{
					pipeSitters = pipeSitters + "|";
				}
				
			}
			console.log(pipeSitters);
			//console.log(rows);
			//response.json({success:true});
			
			//console.log("/additionalFeature/addAdditionalFeature[response] - " + stResp);
		});	
};

	
	
	
	
	
	
	
	
	
	
};//end page
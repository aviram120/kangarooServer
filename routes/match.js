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
				pipeSitters = pipeSitters + rows[i].id ;
				
				if (i+1 != rows.length)
				{
					pipeSitters = pipeSitters + "|";
				}
				
			}
			//insert to db (table matchEventSitter)
			//send push to all sitter
			console.log(pipeSitters);
		});	
		getJob(89,65);
};

this.getJob =  function (eventId,sitterId) {
	
	var query = "SELECT * FROM  `event` event Left Join `user` user ON(event.`parent_id` = user.`id`) WHERE  `id_event` =89";
	connectDatabase().query(query, function(err, rows) {
			if (err) {
				console.log('error: ', err);
				throw err;
			}
			
			
			console.log(rows);
		});	
	
	
};


	
	
	
	
	
	
	
	
	
	
};//end page
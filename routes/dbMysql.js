var mysql = require('mysql');

module.exports = function() { 

var mysqlConnector;
    var settings = {
	  host     : 'mysql1418.opentransfer.com',
	  user     : '*************',
	  password : '*************',
	  database : 'AAAljt4_kangaroo',
      insecureAuth: true
	};
	
var settings2 = {
	  host     : 'us-cdbr-iron-east-04.cleardb.net',
	  user     : '*************',
	  password : '*************',
	  database : 'heroku_ef18e6aa5b82674'
	};
	
this.connectDatabase =  function () {
    if (!mysqlConnector) {
        mysqlConnector = mysql.createPool(settings);
		//mysqlConnector = mysql.createConnection(settings);

		//mysqlConnector.connect(function(err){
        mysqlConnector.getConnection(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return mysqlConnector;
};

}


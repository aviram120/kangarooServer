var util = require('util')
var url = require('url')
var client = require ('mongodb').MongoClient

var dbConnUrl = process.env.MONGODB_URI


console.log('db server: ', dbConnUrl)

client.connect(dbConnUrl, {}, function(error, db) {
	console.log('error: ', error)
	db.listCollections().toArray(function(err, collections) {
    console.log('error: ', error)
		console.log('collections: ', collections)
    db.close()
	})
})
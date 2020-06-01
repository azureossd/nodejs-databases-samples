'use strict'

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://<username>:<password>@<endpoint>.documents.azure.com:10255/?ssl=true';
var db = null

MongoClient.connect(url, { useUnifiedTopology: true },function(err, client) {
    if(err) { console.error(err) }
    console.log("Connected to database")
    db = client.db('demo') 
})

app.get('/', function (req, res) {    
  db.collection('users').find({}).toArray(function(err, docs) {
    if(err) { 
      console.error(err); 
      res.send(err);
    }
    res.send(JSON.stringify(docs))
  });
});

app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))
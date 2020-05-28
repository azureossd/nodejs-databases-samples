'use strict'

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

var mysql = require('mysql');
var con = mysql.createConnection({
    host     : '****.mysql.database.azure.com',
    user     : 'support@databaseserver',
    password : '************',
    database : 'demo'
  });

//For SSL connections with Azure Database for MySQL check this documentation: https://docs.microsoft.com/en-us/azure/mysql/concepts-ssl-connection-security  

app.get('/', function (req, res) {    
  con.connect(function(err) {
    if (err){ 
      res.send(err);
    } else {
      console.log("Connected to database");
      var value = 100;
      con.query(`select * from Users where id = ${value}`, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        res.send(result);
      });
    }
  });
});

app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))
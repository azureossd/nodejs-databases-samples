'use strict'

const express = require('express')
const app = express()
const sql = require('mssql')
const port = process.env.PORT || 3000;

const config = {
    server: '*****.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'databasename',
    user: 'support',
    password: '*******',
    options: {
        enableArithAbort: true,
        encrypt: true, // If you are Windows Azure use true
        port: 1433
      },
}

app.get('/', function (req, res) {    
    sql.connect(config).then(() => {
        console.log("Connected to database")
        var value = 680
        return sql.query`select * from [SalesLT].[Product] where ProductID = ${value}`
    }).then(result => {
        res.send(result);
    }).catch(err => {
        console.log(err);
        res.send(err);
    })
});

app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))

'use strict'

const express = require('express')
const app = express()
const mariadb = require('mariadb');
const port = process.env.PORT || 3000;

const config = {
     host: 'host', 
     user:'user', 
     password: 'password',
     database: 'database'
};

app.get('/', function (req, res) {  
    mariadb.createConnection(config)
    .then(conn => {
      conn.query("SELECT * FROM Users")
        .then(rows => {
          console.log(rows); 
          conn.end();
          res.send(JSON.stringify(rows))
        })
        .catch(err => { 
            res.send(err)
        });
    })
    .catch(err => {
        res.send(err)
    });
});
  
app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))
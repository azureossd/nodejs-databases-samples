'use strict'

const express = require('express')
const app = express()
const { Pool } = require('pg')
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'hostname',
    database: 'database',
    password: 'password',
    port: 5432,
})

app.get('/', async function (req, res) {  
    try {
        const result = await pool.query('SELECT * FROM public."Users";');
        res.send(JSON.stringify(result.rows))
    } catch (err) {
        console.log(err.stack)
        res.send(err)
    }
});
  
app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))
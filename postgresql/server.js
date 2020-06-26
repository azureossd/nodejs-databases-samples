'use strict'

const express = require('express')
const app = express()
const { Pool } = require('pg')
const fs = require('fs');
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('certificates/BaltimoreCyberTrustRoot.crt.pem').toString(),
      },
})

pool.on('error', (err, client) => {
    console.error('Error:', err);
});


global.messages = [];

async function CreateTable() {

    const query = `
        DROP TABLE IF EXISTS Users;
        CREATE TABLE Users (id serial PRIMARY KEY, name VARCHAR(50), lastname VARCHAR(50));
    `;

    try {
        const client = await pool.connect();
        const res = await client.query(query);

        messages.push('Table created');

    } catch (err) {
        console.error(err);
    }

}

async function QueryRow() {
    const query = `SELECT * FROM Users WHERE Id=1;`;

    try {
        const client = await pool.connect();
        const res = await client.query(query);
        const rows = res.rows; 
        messages.push(`Querying from Table and selecting user ${ JSON.stringify(rows[0]) }`);
    } catch (err) {
        console.error(err);
    }
}


async function QueryAllRows() {
    const query = 'SELECT * FROM Users;';
    try {
        const client = await pool.connect();
        const res = await client.query(query);
        messages.push('Quering all users');
        const rows = res.rows; 
        rows.map(row => {
            messages.push(`---- Reading User: ${JSON.stringify(row)}`);
        });
    } catch (err) {
        console.log(err.stack)
    }
}

async function InsertRow() {
    const query = `INSERT INTO Users(name, lastname) VALUES ('Name- ${ randomString() }', 'LastName-${ randomString() }')`;
    try {
        const client = await pool.connect();
        const res = await client.query(query);
        messages.push('Adding a new user');
    } catch (err) {
        console.log(err.stack)
    }
}

async function UpdateRow() {
    const query = `UPDATE Users SET lastname='LastName-Updated' WHERE Id=2`;
    try {
        const client = await pool.connect();
        const res = await client.query(query);
        messages.push('Updating LastName on user');
    } catch (err) {
        console.log(err.stack)
    }
}


async function DeleteRow() {
    const query = 'DELETE FROM Users WHERE Id=1';
    try {
        const client = await pool.connect();
        const res = await client.query(query);
        messages.push('Deleting user');
    } catch (err) {
        console.log(err.stack)
    }
}

async function DeleteTable() {
    const query = 'DROP TABLE Users';
    try {
        const client = await pool.connect();
        const res = await client.query(query);
        messages.push('Dropping table');
    } catch (err) {
        console.log(err.stack)
    }
}

function randomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.get('/', async function (req, res) {  
    try {

        await CreateTable();
        await InsertRow();
        await QueryRow();
        await InsertRow();
        await QueryAllRows();
        await UpdateRow();
        await DeleteRow();
        await QueryAllRows();
        await DeleteTable();

        res.send(JSON.stringify(messages))
    } catch (err) {
        console.log(err.stack)
        res.send(err)
    }
});
  
app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))
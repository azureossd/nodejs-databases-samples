# Connecting an Express REST API with MongoDB

## Requirements
1. Node.js/npm
2. Visual Code
3. [Curl](https://curl.se/windows/) or [PostMan](https://www.postman.com/downloads/)
4. [MongoDB Compass](https://www.mongodb.com/try/download/compass)
5. Docker Desktop

## Setting up MongoDB  
1. If you are using Windows, create a directory `c:/db` for the database.
2. Then create another folder directory for your application (any location). 
3. Cd into your application folder and create a **`docker-compose.yml`** file with the following content:

    ```
    version: "3.8"
    services:
    mongodb:
        image: mongo:4.2.16-bionic
        container_name: mongodb
        restart: unless-stopped
        command: mongod --auth
        ports:
        - 27017:27017
        environment:
        MONGO_INITDB_ROOT_USERNAME: admin
        MONGO_INITDB_ROOT_PASSWORD: password
        MONGO_INITDB_DATABASE: admin
        MONGODB_DATA_DIR: /data/db
        volumes:
            - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
            - c:/db:/data/db
    ```
    >Note: You can change the user and password for admin user, just update the mongo-init.js file.

    This file will create a MongoDb Docker container with admin user and password pointing to admin database, it will map two volumes, one for c:/db folder to /data/db (If you are using Linux you might need to change this directory) and another one for a init script to create a database and app user.

4. Create a new file called **`mongo-init.js`** with the following content:
    ```
    db.auth('admin', 'password')

    db = db.getSiblingDB('dbsample')

    db.createUser(
        {
            user: "mongouser",
            pwd: "password",
            roles: [
                {
                    role: "readWrite",
                    db: "dbsample"
                }
            ]
        }
    );

    db.createCollection('users');

    db.users.insert(
    {
        first_name: 'firstname',
        last_name: 'lastname'
    });
    ```
    >Note: You can change the user and password for the app user, you need to update code.

5. Start Docker Desktop and run the following command into a terminal(cmd) to start the container. **`docker-compose up`**.

## Connecting to MongoDB using a client
1. You can use a free client to connect to the new created database. Download and install it from here: https://www.mongodb.com/try/download/compass
2. You can set the connection URL **mongodb://admin:password@localhost:27017/** and then connect.
3. Review the **dbsample** database created.

## Creating Express REST API
1. Type **`npm init`** and follow all steps, use `server.js` as entry point.
2. Create a **server.js** with the following content (if you changed the user/password then update with the new values):
    ```
        const express = require('express');
        const app = express();
        const mongoose = require('mongoose');
        const port = process.env.PORT || 3000;
        const url = 'mongodb://mongouser:password@localhost:27017/dbsample';

        //middlewares


        const options = {
            autoIndex: false, // Don't build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };

        mongoose.connect(url, options).catch(err => console.log(`Database client was not able to connect, Error: ${err}`));

        app.get("/",  (req, res) => {
            res.send({message: "REST API with Mongoose."});
        });

        //routes

        app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`));

    ```

3. Open a new terminal and cd into the application folder and start the server with **`npm start`** and browse to **`http://localhost:30000`**. (If the connection is not successful you will get an exception.)
4. Create a new folder called **`models`** and add a new file named **`user.js`**, and create the following schema with this content:
    ```
        const mongoose = require("mongoose")

        const schema = mongoose.Schema({
            first_name: String,
            last_name: String,
        })

        module.exports = mongoose.model("User", schema)
    ```
5. Import the module in `server.js` with:
    ```
        const User = require('./models/user');
    ```
6. Add the following routes for CRUD operations. 
    ```
        app.get("/users", async (req, res) => {
            try{
                const users = await User.find();
                res.send(users);
            }catch(err){
                res.send({error: err});
            }
        });

        app.get("/users/:id", async (req, res) => {
            try {
                const user = await User.findOne({ _id: req.params.id })
                res.send(user);
            } catch {
                res.status(404)
                res.send({ error: "User doesn't exist!" });
            }
        });

        app.post("/users", async (req, res) => {
            try{
                const user = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                })
                await user.save();
                res.send(user);
            }catch(err){
                res.send({error: err});
            }
        });

        app.patch("/users/:id", async (req, res) => {
            try {
                const user = await User.findOne({ _id: req.params.id })

                if (req.body.first_name)
                    user.first_name = req.body.first_name

                if (req.body.last_name) 
                    user.last_name = req.body.last_name

                await user.save();
                res.send(user);

            } catch {
                res.status(404)
                res.send({ error: "User doesn't exist!" });
            }
        });

        app.delete("/users/:id", async (req, res) => {
            try {
                await User.deleteOne({ _id: req.params.id })
                res.status(204).send();
            } catch {
                res.status(404);
                res.send({ error: "User doesn't exist!" })
            }
        });
    ```
7. Finally add a built-in middleware function, which parses incoming requests with JSON payloads and is based on body-parser. Add it after the const variables in the top.
    ```
        app.use(express.json());
    ```
8. Start the server with **`npm start`** and browse to **`http://localhost:30000`**.
9. You can use postman or curl to test this application. Here is an example for POST
   - If you have curl use the following command: 
        ```
        curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{\"first_name\":\"RandomFirstName\",\"last_name\":\"RandomLastName\"}'
        ```
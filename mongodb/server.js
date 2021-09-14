const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const User = require('./models/user');
const url = 'mongodb://mongouser:password@localhost:27017/dbsample';

app.use(express.json());

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

app.listen(port, () => console.log(`App listening at http://0.0.0.0:${port}`))
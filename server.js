const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo_client = require('mongodb').MongoClient

const db_name_notes = 'notes';
const db_name_users = 'users';

let db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongodb initialize and list on port
mongo_client.connect('mongodb://airnote:airnote@ds143030.mlab.com:43030/airnote_db',
	(err, database) => {
		if (err)
			return console.log(err)
		db = database
		app.listen(2000, () => {
			console.log('listening on 2000 with db');
		})
	}
);

//Check if connected
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the REST API' });
});

//CRUD operation
app.get('/notes', (req, res) => {
	db.collection(db_name_notes).find().toArray((err, messages) => {
		if (err)
			res.send(err);
		res.json({ message: messages });
	})
})

app.post('/notes', (req, res) => {
	db.collection(db_name_notes).save(req.body, (err, result) => {
		if (err)
			res.send(err);
		res.json({ message: 'note created successfully!' });
	})
})

app.put('/notes', (req, res) => {
	db.collection(db_name_notes)
		.findOneAndUpdate({ name: req.body.name }, {
			$set: {
				name: req.body.name,
				quote: req.body.quote
			}
		}, {
			sort: { _id: -1 },
			upsert: true
		}, (err, messages) => {
			if (err)
				res.send(err);
			res.json({ message: messages });
		})
})

app.delete('/notes', (req, res) => {
	db.collection(db_name_notes)
		.findOneAndDelete({ name: req.body.name },
		(err, messages) => {
			if (err)
				res.send(err);
			res.json({ message: messages });
		})
})
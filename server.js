/** Installation and Viewing Guide:
 * npm init
 * npm install express mongo mongodb body-parser cors
 * node server.js
 * http://localhost:8888/computerparts
 */

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/computerparts', express.static(path.join(__dirname + '/public')));

const dbName = 'computer'; // Collection name
const dbURL = 'mongodb+srv://user:password@databasename.code.mongodb.net/collentionname'; // MongoDB database connection link

var db;

app.listen(8888, () => {
    console.log('Server is Running on localport:8888/computerparts');
    MongoClient.connect(dbURL, (err, client) => {
        if (err) {
            console.log('Error Connecting to Database');
            throw err;
        }
        console.log('Connected to MongoDB Database');
        db = client.db(dbName);
    });
});

app.get('/computer/partsdb', (req, res) => {
    let parts = db.collection('partsdb');
    parts.find().toArray((err, part) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send(part); // List Database
    });
});

app.post('/computer/partsdb', (req, res) => {
    let parts = db.collection('partsdb');
    let part = {
        name: req.body.name,
        description: req.body.description
    }
    if (part.name) {
        parts.insertOne(part); // Add Document
    }
    else if (req.body.nametodelete) {
        parts.deleteOne({ 'name' : req.body.nametodelete }); // Delete Document
    }
    res.redirect('/computerparts');
});

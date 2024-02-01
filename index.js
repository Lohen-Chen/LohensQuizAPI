var express = require('express');
var app = express();
var fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 8080;
const cors = require("cors");


const db = new sqlite3.Database('./data/scores.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

db.run(`
CREATE TABLE IF NOT EXISTS scores (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT,
   time FLOAT
)`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Checked state of the "scores" table, EXISTS');
  }
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", 'https://15c34420-a05e-43af-898b-5d343bb150c9-00-t64fp8c4i677.worf.replit.dev/');
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors());
app.use(express());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/test', (req,res) => {
  console.log("attempted to access test function");
  res.send({"message": "connection successful"});
});

app.post('/testpost', (req,res) => {
  console.log("posting is enabled");
})

app.post('/postscore/:username/:time', (req, res) => {
  try {
    let username = req.params.username;
    let score = parseFloat(req.params.time);

    db.run(`INSERT INTO scores (username, time) VALUES (?, ?)`, [username, score], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send(err.message);
      } else {
        res.sendStatus(200);
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});


app.get('/getall', (req, res) => {
  try {
    db.all(`SELECT * FROM scores`, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send(err.message);
      } else {
        res.json(rows);
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});


app.listen(port, () => {
  console.log('server started');
});

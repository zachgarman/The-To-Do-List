var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'todolist'
}

var pool = new pg.Pool(config);

router.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM todos;', function (err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
        console.log(result.rows);
        res.send(result.rows);
      });
    } finally {
      done();
    }
  });
});

router.post('/', function(req, res) {
  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO todos (list_item, crossed_off) ' +
      'VALUES ($1, $2);',
      [req.body.listItem, req.body.crossedOff],
      function(err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
        console.log(result.rows);
        res.send(result.rows);
      });
    } finally {
      done();
    }
  });
});

module.exports = router;

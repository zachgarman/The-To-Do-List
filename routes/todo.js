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

      client.query('SELECT * FROM todos ORDER BY crossed_off, LOWER(list_item);', function (err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
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

router.put('/update', function(req, res) {
  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }
      // Incoming req.body.crossed is a string representation of the
      // current state of the td, but a boolean is needed.  boolean
      // is assigned opposite value of current condition because that is what
      // we are changing it into.
      if (req.body.crossed == 'true') {
        req.body.crossed = false;
      } else {
        req.body.crossed = true;
      }

      client.query('UPDATE todos SET crossed_off=$1 WHERE id=$2;',
      [req.body.crossed, req.body.id],
      function(err, result) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    } finally {
      done();
    }
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;
  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to the DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('DELETE FROM todos WHERE id = $1;', [id], function(err, result) {
        if (err) {
          console.log('Error querying the DB', err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200);
      });
    } finally {
      done();
    }
  });
});

module.exports = router;

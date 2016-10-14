var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'todoslist'
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

      client.query('SELECT * FROM owners;', function (err, result) {
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

module.exports = router;

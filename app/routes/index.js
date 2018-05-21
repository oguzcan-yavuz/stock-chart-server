'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
  res.json("server is up!");
});

module.exports = router;

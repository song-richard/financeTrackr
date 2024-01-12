const router = require('express').Router();
const routes = require('./api/routes');

router.use('/', routes);

module.exports = router;
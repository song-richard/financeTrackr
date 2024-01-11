const router = require('express').Router();
const homeRoutes = require('./api/routes');
const apiRoutes = require('./api/routes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;
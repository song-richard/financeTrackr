const router = require('express').Router();
const loginroutes = require('./loginroutes');

router.use('/login', loginroutes);

module.exports = router;
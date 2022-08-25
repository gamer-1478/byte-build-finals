const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated } = require('../middlewares/authenticate.js');

router.post('/:query', ensureAuthenticated, (req, res)=> {
    const query = req.params.query
})

module.exports = router ;
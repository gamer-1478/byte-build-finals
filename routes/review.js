const express = require('express'),
    router = express.Router(),
    {ensureAuthenticated} = require('../middlewares/authenticate'),
    { review_post} = require('../controllers/review')
 
router.post('/:id', ensureAuthenticated, review_post)

module.exports = router
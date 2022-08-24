const express = require('express'),
    router = express.Router(),
    {ensureAuthenticated} = require('../middlewares/authenticate'),
    {review_get, review_post} = require('../controllers/review')
 
router.get('/:id', ensureAuthenticated, review_get)
router.post('/:id', ensureAuthenticated, review_post)

module.exports = router
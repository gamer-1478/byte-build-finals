const express = require('express'),
    router = express.Router(),
    {ensureAuthenticated} = require('../middlewares/authenticate'),
    {profile_get, profile_update} = require('../controllers/profile')
 
router.get('/', ensureAuthenticated, profile_get)
router.post('/', ensureAuthenticated, profile_update)

module.exports = router
const express = require('express'),
    router = express.Router(),
    {store_admin, store_admin_create, store_admin_get_product,store_admin_post_product, store_admin_delete_product, store, store_item_view, store_item_buy, store_search}  = require('../controllers/store.js'),
    {ensureAdminAuthenticated, ensureAuthenticated} = require('../middlewares/authenticate.js')

//store customer routes
router.get('/', store)
router.get('/view/:id', store_item_view)
router.post('/buy/:id', ensureAuthenticated, store_item_buy)
router.get('/search', store_search)


//store admin routes
router.get('/admin', ensureAdminAuthenticated, store_admin)
router.post('/admin/create', ensureAdminAuthenticated, store_admin_create)
router.get('/admin/create/:id', ensureAdminAuthenticated, store_admin_get_product)
router.post('/admin/edit/:id', ensureAdminAuthenticated,  store_admin_post_product)
router.post('/admin/delete/:id', ensureAdminAuthenticated, store_admin_delete_product)


module.exports = router;
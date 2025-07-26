const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.get('/auth-check', UserController.authCheck);
router.post('/logout', UserController.logout);

module.exports = router;
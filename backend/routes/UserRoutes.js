const router = require('express').Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', UserController.create);
router.post('/login', UserController.login);
router.get('/auth-check', authMiddleware, UserController.authCheck);
router.post('/logout', authMiddleware, UserController.logout);

module.exports = router;
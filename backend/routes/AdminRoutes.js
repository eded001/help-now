const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', AdminController.dashboard);
router.get('/users', AdminController.getUsers);

module.exports = router;
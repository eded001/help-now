const router = require('express').Router();
// const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.use(authMiddleware);
router.use(adminMiddleware);

// router.get('/dashboard', AdminController.dashboard);
// router.get('/users', AdminController.getUsers);

module.exports = router;
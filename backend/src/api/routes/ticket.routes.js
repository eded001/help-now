const router = require('express').Router();
const ticketController = require('../controllers/ticket.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/', auth, ticketController.getByUsername);
router.get('/unassigned', auth, ticketController.getUnassigned);
router.get('/:id', auth, ticketController.getById);
router.post('/', auth, ticketController.create);
router.patch('/:id', auth, ticketController.update);
router.patch('/:id/assign', auth, ticketController.assign);
router.delete('/:id', auth, ticketController.remove);

module.exports = router;
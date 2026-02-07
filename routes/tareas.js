const express = require('express');
const { getTareas, createTarea, updateTarea, deleteTarea } = require('../controllers/tareasController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware); 

router.get('/', getTareas);
router.post('/', createTarea);
router.put('/:id', updateTarea);
router.delete('/:id', deleteTarea);

module.exports = router;

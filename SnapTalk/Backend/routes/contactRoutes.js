const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getContacts, addContact, removeContact } = require('../controllers/contactController');

router.use(authMiddleware);

router.get('/', getContacts);
router.post('/', addContact);
router.delete('/:contactId', removeContact);

module.exports = router;

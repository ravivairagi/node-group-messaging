const router = require('express').Router();
const { validateAddUser, validateLogin, validateEditUser } = require('../middleware/validation');
const { addUser, signIn, getUsers, updateUser } = require('../controllers/user.controller');
const { isAuthenticate, isAdmin } = require('../middleware/auth');

router.post('/login', validateLogin, signIn);
router.post('/', isAuthenticate, isAdmin, validateAddUser, addUser);
router.get('/list', isAuthenticate, getUsers);
router.put('/:id', isAuthenticate, isAdmin, validateEditUser, updateUser);

module.exports = router;

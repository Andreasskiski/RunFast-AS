const express = require('express')

const { register, login, getUser, getAllUsers, updateUser, deleteUser} = require('../controllers/userController')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/getUser/:id', getUser);
router.get('/getAllUsers', getAllUsers);

router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;
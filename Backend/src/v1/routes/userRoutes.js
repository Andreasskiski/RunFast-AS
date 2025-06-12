const express = require('express')

const { register, login, getUser, getAllUsers, updateUser, deleteUser, updateMembershipPlan} = require('../controllers/userController')
const { authenticateToken, authorizeRoles } = require('../middlewares/MWauthentication')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/getUser/:id', getUser);
router.get('/getAllUsers', getAllUsers);

router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

router.patch('/updateMembershipPlan/:id', authenticateToken, updateMembershipPlan);

module.exports = router;
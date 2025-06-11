const express = require('express');

const { registerSession, getSession, getAllSessions, getAllSessionsByLocation, updateSession, deleteSession } = require('../controllers/spinningController');

const router = express.Router();

router.post('/registerSession', registerSession);

router.get('/getSession/:id', getSession);
router.get('/getAllSessions', getAllSessions);
router.get('/getAllSessionsByLocation/:location', getAllSessionsByLocation);

router.put('/updateSession/:id', updateSession);
router.delete('/deleteSession/:id', deleteSession);

module.exports = router;
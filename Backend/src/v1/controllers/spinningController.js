const {pool} = require ('../data/db')

const registerSession = async (req, res) => {
    const { location, sessionDate, startTime, endTime, availableSlots, instructorName  } = req.body;
    try {
        const [results] = await pool.query(
            'INSERT INTO SpinningSession (location, sessionDate, startTime, endTime, availableSlots, instructorName ) VALUES (?, ?, ?, ?, ?, ?)',
            [location, sessionDate, startTime, endTime, availableSlots, instructorName]
        );

        res.status(201).json({
            id: results.insertid,
            location,
            sessionDate,
            startTime,
            endTime,
            availableSlots,
            instructorName
        })
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

const getSession = async (req, res) => {
    const { id } = req.params;
    try {
        const [session] = await pool.query('SELECT * FROM SpinningSession WHERE sessionID = ?', [id]);
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllSessions = async (req, res) => {
    try {
        const [sessions] = await pool.query('SELECT * FROM SpinningSession');
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllSessionsByLocation = async (req, res) => {
    const { location } = req.params;
    try {
        const [sessions] = await pool.query('SELECT * FROM SpinningSession WHERE location = ?', [location]);
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateSession = async (req, res) => {
    const { id } = req.params;
    const { location, sessionDate, startTime, endTime, availableSlots, instructorName } = req.body;
    try {
        await pool.query('UPDATE SpinningSession SET location = ?, sessionDate = ?, startTime = ?, endTime = ?, availableSlots = ?, instructorName = ? WHERE sessionID = ?',
            [location, sessionDate, startTime, endTime, availableSlots, instructorName, id]);
        res.status(200).json({ message: "session updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteSession = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM SpinningSession WHERE sessionID = ?', [id]);
        res.status(200).json({ message: "session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerSession,
    getSession,
    getAllSessions,
    getAllSessionsByLocation,
    updateSession,
    deleteSession
}
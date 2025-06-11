const { pool } = require('../data/db');

// BOOK a spinning session
const bookSession = async (req, res) => {
    const { sessionID } = req.body;
    const userID = req.user.userID;

    try {
        // Check membership plan
        const [[user]] = await pool.query('SELECT * FROM Users WHERE userID = ?', [userID]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.membershipPlan.toLowerCase() !== 'premium') {
            return res.status(403).json({ message: 'Only premium members can book spinning sessions.' });
        }

        // Check available slots
        const [[session]] = await pool.query('SELECT * FROM SpinningSession WHERE sessionID = ?', [sessionID]);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (session.availableSlots <= 0) {
            return res.status(400).json({ message: 'No available slots in this session.' });
        }

        // Book it
        await pool.query('INSERT INTO Bookings (userID, sessionID) VALUES (?, ?)', [userID, sessionID]);
        await pool.query('UPDATE SpinningSession SET availableSlots = availableSlots - 1 WHERE sessionID = ?', [sessionID]);

        return res.status(201).json({ message: 'Session booked successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE booking
const deleteBooking = async (req, res) => {
    const { bookingID } = req.params;
    const userID = req.user.userID;

    try {
        // Find booking
        const [[booking]] = await pool.query('SELECT * FROM Bookings WHERE bookingID = ? AND userID = ?', [bookingID, userID]);
        if (!booking) return res.status(404).json({ message: 'Booking not found or unauthorized' });

        // Delete booking and update slots
        await pool.query('DELETE FROM Bookings WHERE bookingID = ?', [bookingID]);
        await pool.query('UPDATE SpinningSession SET availableSlots = availableSlots + 1 WHERE sessionID = ?', [booking.sessionID]);

        return res.status(200).json({ message: 'Booking cancelled successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    const userID = req.user.userID;

    try {
        const [bookings] = await pool.query(
            `SELECT b.bookingID, s.sessionID, s.location, s.sessionDate, s.startTime, s.endTime, s.instructorName
             FROM Bookings b
             JOIN SpinningSession s ON b.sessionID = s.sessionID
             WHERE b.userID = ?`,
            [userID]
        );

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookSession,
    deleteBooking,
    getMyBookings
};
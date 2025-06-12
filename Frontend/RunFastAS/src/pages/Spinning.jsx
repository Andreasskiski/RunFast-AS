import React, { useEffect, useState } from 'react';

export default function Spinning() {
  const [allSessions, setAllSessions] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSessions();
    fetchMyBookings();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/spinning/getAllSessions');
      const data = await res.json();
      setAllSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/booking/myBookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMyBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  const handleJoin = async (sessionID) => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/booking/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionID }),
      });

      if (res.ok) {
        await fetchSessions();
        await fetchMyBookings();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to book session');
      }
    } catch (err) {
      console.error('Booking error:', err);
    }
  };

  const handleWithdraw = async (bookingID) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/booking/deleteBooking/${bookingID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchSessions();
        await fetchMyBookings();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to withdraw booking');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
    }
  };

  // Extract IDs of booked sessions for filtering
  const bookedSessionIDs = myBookings.map((b) => b.sessionID);
  const unbookedSessions = allSessions.filter((s) => !bookedSessionIDs.includes(s.sessionID));

  return (
    <div className="spinning-page">
      <h2>My Booked Spinning Sessions</h2>
      {myBookings.length === 0 ? (
        <p>You haven't booked any sessions yet.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Location</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Slots</th>
              <th>Instructor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myBookings.map((s) => (
              <tr key={s.sessionID}>
                <td>{s.location}</td>
                <td>{s.sessionDate}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>{s.availableSlots}</td>
                <td>{s.instructorName}</td>
                <td>
                  <button onClick={() => handleWithdraw(s.bookingID)}>Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Available Spinning Sessions</h2>
      {unbookedSessions.length === 0 ? (
        <p>No available sessions.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Location</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Slots</th>
              <th>Instructor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {unbookedSessions.map((s) => (
              <tr key={s.sessionID}>
                <td>{s.location}</td>
                <td>{s.sessionDate}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>{s.availableSlots}</td>
                <td>{s.instructorName}</td>
                <td>
                  <button onClick={() => handleJoin(s.sessionID)}>Join</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

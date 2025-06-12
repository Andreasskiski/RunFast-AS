import React, { useEffect, useState } from 'react';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', birthdate: '', membershipPlan: '', role: '' });
  const token = localStorage.getItem('token');

  const [spinForm, setSpinForm] = useState({
    location: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    availableSlots: '',
    instructorName: '',
  });
  

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/users/getAllUsers');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`http://localhost:3000/api/v1/users/deleteUser/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllUsers();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCreate = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', email: '', password: '', birthdate: '', membershipPlan: '', role: '' });
      fetchAllUsers();
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const handleUpdate = async (userID) => {
    try {
      await fetch(`http://localhost:3000/api/v1/users/updateUser/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      fetchAllUsers();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleCreateSpinSession = async () => {
    if (!token || role !== 'admin') {
      alert("You must be logged in as admin");
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/v1/spinning/registerSession', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(spinForm)
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create spinning session');
      }
  
      alert('Spinning session created successfully');
      setSpinForm({ location: '', sessionDate: '', startTime: '', endTime: '', availableSlots: '', instructorName: '' });
    } catch (err) {
      console.error('Error creating session:', err);
      alert(err.message);
    }
  };
  

  return (
    <div className='admin-panel'>
      <h2>Admin Dashboard</h2>

      <h3>Create Spinning Session</h3>
        <div className='form'>
        <select value={spinForm.location} onChange={(e) => setSpinForm({ ...spinForm, location: e.target.value })}>
            <option value=''>Select Location</option>
            <option value='Grorud'>Grorud</option>
            <option value='Stovner'>Stovner</option>
            <option value='Vålerenga'>Vålerenga</option>
            <option value='Bryn'>Bryn</option>
        </select>
        <input type='date' value={spinForm.sessionDate} onChange={(e) => setSpinForm({ ...spinForm, sessionDate: e.target.value })} />
        <input type='time' value={spinForm.startTime} onChange={(e) => setSpinForm({ ...spinForm, startTime: e.target.value })} />
        <input type='time' value={spinForm.endTime} onChange={(e) => setSpinForm({ ...spinForm, endTime: e.target.value })} />
        <input type='number' placeholder='Available Slots' value={spinForm.availableSlots} onChange={(e) => setSpinForm({ ...spinForm, availableSlots: e.target.value })} />
        <input type='text' placeholder='Instructor Name' value={spinForm.instructorName} onChange={(e) => setSpinForm({ ...spinForm, instructorName: e.target.value })} />
        <button onClick={handleCreateSpinSession}>Create Spinning Session</button>
        </div>


      <h3>Create New User</h3>
      <div className='form'>
        <input placeholder='Name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder='Email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder='Password' type='password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder='Birthdate' type='date' value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
        <select value={form.membershipPlan} onChange={(e) => setForm({ ...form, membershipPlan: e.target.value })} style={{ marginLeft: '1rem' }}>
          <option value="no_plan">No Plan</option>
          <option value="basic">Basic ($20/month)</option>
          <option value="premium">Premium ($40/month)</option>
        </select>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value=''>Select Role</option>
          <option value='user'>User</option>
          <option value='admin'>Admin</option>
        </select>
        <button onClick={handleCreate}>Create User</button>
      </div>

      <h3>All Users</h3>
      <table border='1'>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userID}>
              <td>{u.userID}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.membershipPlan}</td>
              <td>
                <button onClick={() => setForm(u)}>Edit</button>
                <button onClick={() => handleUpdate(u.userID)}>Save</button>
                <button onClick={() => handleDelete(u.userID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

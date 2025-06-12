import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    membershipPlan: '',
    role: 'user', // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert('User registered successfully!');
        setForm({
          name: '',
          email: '',
          password: '',
          birthdate: '',
          membershipPlan: '',
          role: 'user',
        });
      } else {
        alert(`Registration failed: ${data.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register User</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          required
        />
        <select value={form.membershipPlan} onChange={handleChange} style={{ marginLeft: '1rem' }}>
          <option value="no_plan">No Plan</option>
          <option value="basic">Basic ($20/month)</option>
          <option value="premium">Premium ($40/month)</option>
        </select>
        
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

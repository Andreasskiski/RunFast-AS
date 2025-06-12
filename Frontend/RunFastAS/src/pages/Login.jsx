import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logging() {
  const [form, setForm] = useState({ name: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);

        // Decode token to get role
        const payload = JSON.parse(atob(data.token.split('.')[1]));

        if (payload.role === 'admin') {
          navigate('/admin'); // admin dashboard
        } else {
          navigate('/aboutme'); // regular user
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Username"
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
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

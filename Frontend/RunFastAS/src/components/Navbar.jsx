import React, { useEffect, useState } from 'react';
import './navbar.css';

export default function Navbar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    }
  }, []);

  return (
    <nav className='navbar'>
      <h1>RunFastAS</h1>
      <div className='navlinks'>
        <a href='/'>Home</a>
        <a href='/spinning'>Spinning Sessions</a>
        <a href='/register'>Register</a>
        <a href='/login'>Login</a>
        <a href='/aboutme'>My Profile</a>
        {role === 'admin' && <a href='/admin'>Admin Panel</a>}
      </div>
    </nav>
  );
}

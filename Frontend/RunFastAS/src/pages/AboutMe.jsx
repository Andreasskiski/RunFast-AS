import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutMe() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const membershipPrices = {
    "": "Free",
    "basic": "$20/month",
    "premium": "$40/month"
  };

  // Get user info on component load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const res = await fetch(`http://localhost:3000/api/v1/users/getUser/${payload.userID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        setSelectedPlan(data.membershipPlan || '');
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  // Handle dropdown plan change
  const handlePlanChange = async (e) => {
    const newPlan = e.target.value;
    setSelectedPlan(newPlan);

    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:3000/api/v1/users/updateMembershipPlan/${payload.userID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ membershipPlan: newPlan })
      });

      if (!res.ok) throw new Error('Failed to update membership');
      alert('Membership plan updated!');
      setUser((prev) => ({ ...prev, membershipPlan: newPlan }));
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating plan.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading user data...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Welcome, {user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Birthdate:</strong> {user.birthdate}</p>

      <h3>Membership</h3>
      <p>Current Plan: <strong>{selectedPlan || 'No Plan'}</strong></p>
      <p>Cost: <strong>{membershipPrices[selectedPlan]}</strong></p>

      <label>
        Change Plan:
        <select value={selectedPlan} onChange={handlePlanChange} disabled={loading} style={{ marginLeft: '1rem' }}>
          <option value="no_plan">No Plan</option>
          <option value="basic">Basic ($20/month)</option>
          <option value="premium">Premium ($40/month)</option>
        </select>
      </label>
    </div>
  );
}

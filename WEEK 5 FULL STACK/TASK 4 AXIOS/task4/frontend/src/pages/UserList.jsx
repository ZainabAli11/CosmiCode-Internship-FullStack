import React, { useEffect, useState } from 'react';
import '../index.css';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setUsers(data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Server error');
      const added = await res.json();
      setUsers(prev => [...prev, added].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setSuccess('User added');
      setError('');
    } catch {
      setError('Error adding user');
      setSuccess('');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="page-wrapper">
      <main className="container">
        <h1 className="title">Add User</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
          />
          <button className="btn" type="submit" disabled={loading || !name.trim()}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {error && <div className="msg error">{error}</div>}
        {success && <div className="msg success">{success}</div>}

        <h2 className="title" style={{ marginTop: '40px' }}>User List</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length ? (
          <ul className="user-list">
            {users.map(user => (
              <li key={user.id || user.name} className="user-item">
                {user.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </main>
    </div>
  );
}

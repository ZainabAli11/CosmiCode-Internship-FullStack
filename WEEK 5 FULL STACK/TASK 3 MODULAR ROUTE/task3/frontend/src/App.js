import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('signup');
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [strength, setStrength] = useState('');

  const switchTab = (tab) => setActiveTab(tab);

  const checkStrength = (password) => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) return 'Strong';
    if (password.length >= 6) return 'Medium';
    return 'Weak';
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') setStrength(checkStrength(value));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirm) {
      return alert('Passwords do not match');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password
      });
      alert(res.data.message || 'Signup successful');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      alert(res.data.message || 'Login successful');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div className="tabs">
          <button className={activeTab === 'signup' ? 'active' : ''} onClick={() => switchTab('signup')}>Sign Up</button>
          <button className={activeTab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>Login</button>
        </div>

        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="form">
            <input type="text" name="username" placeholder="Full Name" required onChange={handleSignupChange} />
            <input type="email" name="email" placeholder="Email" required onChange={handleSignupChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleSignupChange} />
            <div className={`strength ${strength.toLowerCase()}`}>{strength && `Strength: ${strength}`}</div>
            <input type="password" name="confirm" placeholder="Confirm Password" required onChange={handleSignupChange} />
            <button type="submit">Create Account</button>
          </form>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="form">
            <input type="email" name="email" placeholder="Email" required onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" required onChange={handleLoginChange} />
            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;

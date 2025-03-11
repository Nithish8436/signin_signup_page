import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './AuthForm.css';

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp
      ? 'http://localhost:5000/api/users'
      : 'http://localhost:5000/api/signin';

    try {
      const data = isSignUp ? { username, email, password } : { email, password };
      const response = await axios.post(endpoint, data);
      console.log('Response:', response.data);
      
      alert(isSignUp ? 'User signed up successfully!' : 'User signed in successfully!');

      if (isSignUp) {
        setIsSignUp(false); // Switch to Sign-In mode
      } else {
        navigate('/dashboard'); // Redirect after successful login (change as needed)
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert(isSignUp ? 'Failed to sign up.' : 'Failed to sign in.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button className={isSignUp ? 'active' : ''} onClick={() => setIsSignUp(true)}>Sign Up</button>
        <button className={!isSignUp ? 'active' : ''} onClick={() => setIsSignUp(false)}>Sign In</button>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        {isSignUp && (
          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
        )}
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
    </div>
  );
}

export default AuthForm;

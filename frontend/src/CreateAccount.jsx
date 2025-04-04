/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css'

function CreateAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(location.state ? location.state.username : '');
  const [email, setEmail] = useState(location.state ? location.state.email : '');
  const [password, setPassword] = useState(location.state ? location.state.password : '');
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const method = location.state ? 'PUT' : 'POST';
    const url = location.state ? `http://localhost:8084/users/${location.state.id}` : 'http://localhost:8084/users';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.text();
      
      if (!response.ok) {
        throw new Error(data || 'Failed to create account');
      }
  
      setMessage(location.state ? 'Account updated successfully!' : 'Account created successfully!');
      navigate(''); // Redirect to login page after successful account creation
      setUsername('');
      setEmail('');
      setPassword('');
  
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message);
    }
  };

  return (
    <div className="create-account-container">
      <h2>Sign up</h2>
      <p className="switch-link" >
      Create an account or <a href="/">Sign in</a></p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="checkbox-group">
      <input type="checkbox" id="marketing" />
      <label htmlFor="marketing">
        I do not want to receive emails with advertising, news,
        suggestions or marketing promotions
      </label>
    </div>

    <p className="terms">
      By signing up to create an account, you are accepting our
      <a href="/terms"> terms of service</a> and
      <a href="/privacy"> privacy policy</a>
    </p>


        <button type="submit">Create Account</button>
      </form>
      
     {/* Message display */}
    </div>
  );
}

export default CreateAccount;

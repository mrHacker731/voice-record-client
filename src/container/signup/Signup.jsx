import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css'
import { ClipLoader } from 'react-spinners';
import { BASE_URL } from '../VoiceTest';
import ErrorComponent from '../ErrorComponent';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/create/user`, { username, email, password });
      // localStorage.setItem('authToken', data.token);
      navigate('/login')

    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.message || 'Signup failed');
      } else if (err.request) {
        // Request was made but no response was received
        setError('Server is not responding. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : 'Signup'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      <ErrorComponent message={error} />
    </div>
  );
};

export default Signup;

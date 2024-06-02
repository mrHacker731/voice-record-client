import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import { ClipLoader } from 'react-spinners';
import { BASE_URL } from '../VoiceTest';
import ErrorComponent from '../ErrorComponent';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login/user`, { email, password });
      localStorage.setItem('authToken', data.token);
      navigate('/');
      // console.log(data);

    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.message || 'Login failed');
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">
        {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup here</Link>
      </p>
      <ErrorComponent message={error} />
    </div>
  );
};

export default Login;

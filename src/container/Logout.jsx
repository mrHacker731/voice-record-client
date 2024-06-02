import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // await axios.post('http://localhost:4000/api/v1/logout', null, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });
      
      localStorage.removeItem('authToken');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return <button onClick={handleLogout} className="logout-button">Logout</button>;
};

export default LogoutButton;

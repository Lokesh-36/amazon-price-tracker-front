import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Popup from './Popup';

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  
  const { login, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setPopup({
        show: true,
        message: result.message,
        type: 'success'
      });
      
      // Auto-close popup after 2 seconds
      setTimeout(() => {
        setPopup({ show: false, message: '', type: 'success' });
      }, 2000);
    } else {
      setPopup({
        show: true,
        message: result.message,
        type: 'error'
      });
    }
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: 'success' });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="link-button">
            Sign up here
          </button>
        </p>
      </div>

      <Popup
        message={popup.message}
        type={popup.type}
        isVisible={popup.show}
        onClose={closePopup}
      />
    </div>
  );
};

export default Login;

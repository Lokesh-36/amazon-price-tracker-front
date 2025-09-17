import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Popup from './Popup';

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  
  const { signup, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPopup({
        show: true,
        message: 'Passwords do not match',
        type: 'error'
      });
      return;
    }

    if (formData.password.length < 6) {
      setPopup({
        show: true,
        message: 'Password must be at least 6 characters long',
        type: 'error'
      });
      return;
    }
    
    const result = await signup(formData.name, formData.email, formData.password);
    
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
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-switch">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Login here
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

export default Signup;

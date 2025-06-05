import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

const PriceForm = () => {
  const [form, setForm] = useState({
    url: '',
    desiredPrice: '',
    userEmail: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(form);  
        
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/track`, form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Failed to add product for tracking.');
    }
  };

  return (
    <div className="form-container">
      <h2>🛒 Track Product Price</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="url"
          placeholder="Amazon Product URL"
          value={form.url}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="desiredPrice"
          placeholder="Desired Price (INR)"
          value={form.desiredPrice}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="userEmail"
          placeholder="Your Email"
          value={form.userEmail}
          onChange={handleChange}
          required
        />
        <button type="submit">Start Tracking</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
};

export default PriceForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Popup from './Popup';
import '../styles.css';

const PriceForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    url: '',
    desiredPrice: '',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const [trackedProducts, setTrackedProducts] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: 'success' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(form);  
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/track`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setMessage(res.data.message);
      showPopup('Product added to tracking successfully!', 'success');
      
      // Clear form after successful submission
      setForm({
        url: '',
        desiredPrice: '',
        name: ''
      });
      
      // Refresh the tracked products list
      fetchTrackedProducts();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add product for tracking.';
      setMessage(errorMessage);
      showPopup(errorMessage, 'error');
    }
  };

  const fetchTrackedProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTrackedProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch tracked products:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setMessage('Product removed from tracking.');
      showPopup('Product deleted successfully!', 'success');
      
      // Remove from local state
      setTrackedProducts(trackedProducts.filter(product => product._id !== productId));
    } catch (err) {
      const errorMessage = 'Failed to delete product.';
      setMessage(errorMessage);
      showPopup(errorMessage, 'error');
    }
  };

  // Fetch tracked products when component mounts
  useEffect(() => {
    fetchTrackedProducts();
  }, []);

  return (
    <div className="form-container">
      <h2>Track Product Price</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Start Tracking</button>
      </form>
      {message && <p className="msg">{message}</p>}
      
      {/* Display tracked products */}
      {trackedProducts.length > 0 && (
        <div className="tracked-products">
          <h3>Your Tracked Products ({trackedProducts.length})</h3>
          <ul className="product-list">
            {trackedProducts.map(product => (
              <li key={product._id} className="product-item">
                <div className="product-info">
                  <span className="product-name">{product.name || 'Unnamed Product'}</span>
                  <span className="product-url" title={product.url}>
                    {product.url.length > 50 ? product.url.substring(0, 50) + '...' : product.url}
                  </span>
                  <div className="product-prices">
                    <span className="target-price">Target: ₹{product.desiredPrice}</span>
                    {product.currentPrice && (
                      <span className="current-price">Current: ₹{product.currentPrice}</span>
                    )}
                  </div>
                  {product.lastChecked && (
                    <span className="last-checked">
                      Last checked: {new Date(product.lastChecked).toLocaleString()}
                    </span>
                  )}
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product._id)}
                  title="Delete this product"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Popup
        message={popup.message}
        type={popup.type}
        isVisible={popup.show}
        onClose={closePopup}
      />
    </div>
  );
};

export default PriceForm;

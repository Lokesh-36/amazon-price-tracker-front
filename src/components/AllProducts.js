import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Popup from './Popup';

const AllProducts = () => {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: 'success' });
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching user products from:', `${process.env.REACT_APP_API_URL}/products`);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Response received:', res.data);
      setAllProducts(res.data || []);
    } catch (err) {
      setError('Failed to fetch products: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching user products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      showPopup('Product deleted successfully!', 'success');
      
      // Remove from local state
      setAllProducts(allProducts.filter(product => product._id !== productId));
    } catch (err) {
      const errorMessage = 'Failed to delete product.';
      showPopup(errorMessage, 'error');
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleRefresh = () => {
    fetchAllProducts();
  };

  const getPriceStatus = (product) => {
    if (!product.currentPrice) return 'pending';
    if (product.currentPrice <= product.desiredPrice) return 'target-reached';
    return 'monitoring';
  };

  const getPriceStatusColor = (status) => {
    switch (status) {
      case 'target-reached': return '#28a745';
      case 'monitoring': return '#ffc107';
      case 'pending': return '#6c757d';
      default: return '#333';
    }
  };

  if (loading) {
    return (
      <div className="all-products-container">
        <h2>My Tracked Products</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="all-products-container">
      <div className="header-section">
        <h2>My Tracked Products ({allProducts.length})</h2>
        <button onClick={handleRefresh} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {allProducts.length === 0 ? (
        <p className="no-products">You haven't tracked any products yet. Add some products to get started!</p>
      ) : (
        <div className="all-products-list">
          {allProducts.map(product => {
            const status = getPriceStatus(product);
            return (
              <div key={product._id} className="admin-product-item">
                <div className="product-header">
                  <h4 className="product-title">{product.name || 'Unnamed Product'}</h4>
                  <div className="product-actions">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getPriceStatusColor(status) }}
                    >
                      {status.replace('-', ' ').toUpperCase()}
                    </span>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                      title="Delete this product"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="product-details">
                  <p className="product-url">
                    <strong>URL:</strong> 
                    <a href={product.url} target="_blank" rel="noopener noreferrer">
                      {product.url.length > 80 ? product.url.substring(0, 80) + '...' : product.url}
                    </a>
                  </p>
                  
                  <div className="product-prices">
                    <span className="price-info">
                      <strong>Target:</strong> ₹{product.desiredPrice}
                    </span>
                    {product.currentPrice && (
                      <span className="price-info">
                        <strong>Current:</strong> ₹{product.currentPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="product-meta">
                    {product.lastChecked && (
                      <span><strong>Last Checked:</strong> {new Date(product.lastChecked).toLocaleString()}</span>
                    )}
                    <span><strong>Added:</strong> {new Date(product.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
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

export default AllProducts;

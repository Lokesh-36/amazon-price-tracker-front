import React, { useState } from 'react';
import PriceForm from './components/PriceForm';
import AllProducts from './components/AllProducts';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainApp() {
  const [currentView, setCurrentView] = useState('tracker'); // 'tracker' or 'admin'
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('tracker');
  };

  if (!user) {
    return (
      <div className="auth-wrapper">
        {authView === 'login' ? (
          <Login onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return (
    <div>
      <nav className="nav-header">
        <h1>Amazon Price Tracker</h1>
        <div className="nav-info">
          <span className="user-welcome">Welcome, {user.name}!</span>
        </div>
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${currentView === 'tracker' ? 'active' : ''}`}
            onClick={() => setCurrentView('tracker')}
          >
            Track Products
          </button>
          <button 
            className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentView('admin')}
          >
            My Products
          </button>
          <button 
            className="nav-btn logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main>
        {currentView === 'tracker' && <PriceForm />}
        {currentView === 'admin' && <AllProducts />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        loading: false
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'No token found' });
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
      dispatch({
        type: 'SET_USER',
        payload: res.data.user
      });
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: res.data.user,
          token: res.data.token
        }
      });

      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (name, email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        name,
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: res.data.user,
          token: res.data.token
        }
      });

      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

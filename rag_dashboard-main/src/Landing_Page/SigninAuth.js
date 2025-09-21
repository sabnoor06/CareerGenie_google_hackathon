import { useState } from 'react';
const useSigninAuth = () => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 const baseURL = process.env.REACT_APP_BASE_URL;

  const authenticateUser = async (username, password) => { // why not use await here
    try {
      const response = await fetch(`http://localhost:8080/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message:data
        };
      } else {
        return {
          success: false,
          message: 'Invalid username or password. Please try again.'
          
        };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        message: 'Connection error. Please check if the server is running.'
      };
    }
  };

  const handleSignIn = async (username, password) => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const result = await authenticateUser(username, password);

      if (result.success) {
        setSuccess('Login successful! Redirecting to dashboard...');
        
        localStorage.setItem('user', JSON.stringify(result.message));
        localStorage.setItem('isAuthenticated', 'true');
        setTimeout(() => {
          window.location.href = '/Overview';
        }, 1500);
        
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignIn,
    loading,
    error,
    success,
    setError,
    setSuccess
  };
};

export default useSigninAuth;


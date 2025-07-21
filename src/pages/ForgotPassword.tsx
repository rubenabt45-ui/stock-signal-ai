
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Legacy redirect component - redirects to new reset password request page
const ForgotPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new reset password request page
    navigate('/reset-password-request', { replace: true });
  }, [navigate]);

  return null;
};

export default ForgotPassword;

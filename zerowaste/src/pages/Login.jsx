import { useState } from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const validateForm = () => {
    const errors = {};
    
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    
    // Validate email format
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotPasswordForm = () => {
    const errors = {};
    
    if (!forgotPasswordForm.email.trim()) errors.email = 'Email is required';
    if (!forgotPasswordForm.newPassword) errors.newPassword = 'New Password is required';
    if (!forgotPasswordForm.confirmNewPassword) errors.confirmNewPassword = 'Confirm New Password is required';
    
    // Validate email format
    if (forgotPasswordForm.email && !/\S+@\S+\.\S+/.test(forgotPasswordForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (forgotPasswordForm.newPassword) {
      if (forgotPasswordForm.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters and include a number.';
      } else if (!/[a-zA-Z]/.test(forgotPasswordForm.newPassword)) {
        errors.newPassword = 'Password must be at least 8 characters and include a number.';
      } else if (!/\d/.test(forgotPasswordForm.newPassword)) {
        errors.newPassword = 'Password must be at least 8 characters and include a number.';
      }
    }
    
    // Check password match
    if (forgotPasswordForm.newPassword && forgotPasswordForm.confirmNewPassword && 
        forgotPasswordForm.newPassword !== forgotPasswordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match.';
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // TODO: Implement actual login logic with Firebase Auth
      console.log('Login attempt:', form.email);
      
      // For demo purposes, simulate login with password verification
      // In a real app, this would verify against the stored hashed password
      const hashedPassword = btoa(form.password); // Same hashing as registration
      
      // Check if user exists in localStorage (demo storage)
      const existingUsers = JSON.parse(localStorage.getItem('zerowaste_users') || '[]');
      const user = existingUsers.find(u => u.email === form.email && u.password === hashedPassword);
      
      if (user) {
        // Store user info in localStorage for demo
        localStorage.setItem('zerowaste_user', JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role || 'feeder'
        }));
        
        setSuccess(true);
        // Check for return URL and redirect accordingly
        const returnUrl = localStorage.getItem('zerowaste_return_url');
        if (returnUrl) {
          localStorage.removeItem('zerowaste_return_url');
          window.location.href = returnUrl;
        } else {
          // Redirect to home or dashboard
          window.location.href = '/';
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
      
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForgotPasswordForm()) {
      return;
    }
    
    try {
      // Check if user exists
      const existingUsers = JSON.parse(localStorage.getItem('zerowaste_users') || '[]');
      const userIndex = existingUsers.findIndex(u => u.email === forgotPasswordForm.email);
      
      if (userIndex === -1) {
        setError('No account found with this email address.');
        return;
      }
      
      // Update password
      const hashedPassword = btoa(forgotPasswordForm.newPassword);
      existingUsers[userIndex].password = hashedPassword;
      localStorage.setItem('zerowaste_users', JSON.stringify(existingUsers));
      
      setSuccess(true);
      setShowForgotPassword(false);
      setForgotPasswordForm({ email: '', newPassword: '', confirmNewPassword: '' });
      setError('');
      
      // Show success message
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError('Failed to update password. Please try again.');
    }
  };

  const isFormValid = () => {
    return form.email.trim() && form.password && Object.keys(fieldErrors).length === 0;
  };

  return (
    <div className="container">
      <div className="form-layout">
        <div className="form-info">
          <h1>Welcome Back</h1>
          <p>Log in to your ZeroWaste account and continue making a difference in your community.</p>
          <ul>
            <li>Access your dashboard</li>
            <li>Post or claim donations</li>
            <li>Track your impact</li>
            <li>Connect with the community</li>
          </ul>
        </div>
        
        <div className="form-content">
          <h2>Login</h2>
          <p>Enter your credentials to access your account.</p>
          
          {success && (
            <div className="success">
              <h3>Login successful!</h3>
              <p>Welcome back to ZeroWaste.</p>
            </div>
          )}
          
          <form className="form" onSubmit={handleSubmit}>
            <label>
              <span>Email Address *</span>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="Enter your email"
                className={fieldErrors.email ? 'error-field' : ''}
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </label>

            <label>
              <span>Password *</span>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                placeholder="Enter your password"
                className={fieldErrors.password ? 'error-field' : ''}
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </label>

            <button 
              className="btn large saffron" 
              type="submit" 
              disabled={submitting || !isFormValid()}
            >
              {submitting ? 'Logging in...' : 'Log In'}
            </button>

            {error && <div className="error">{error}</div>}
          </form>

          <div className="login-footer">
            <p className="muted">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
            <p className="muted">
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(true)}
                style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Forgot your password?
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="forgot-password-content">
            <h3>Reset Password</h3>
            <p>Enter your email and new password to reset your account.</p>
            
            <form className="form" onSubmit={handleForgotPasswordSubmit}>
              <label>
                <span>Email Address *</span>
                <input 
                  type="email" 
                  name="email" 
                  value={forgotPasswordForm.email} 
                  onChange={handleForgotPasswordChange} 
                  required 
                />
              </label>

              <label>
                <span>New Password *</span>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={forgotPasswordForm.newPassword} 
                  onChange={handleForgotPasswordChange} 
                  required 
                  placeholder="Minimum 8 characters, 1 letter, 1 number"
                />
              </label>

              <label>
                <span>Confirm New Password *</span>
                <input 
                  type="password" 
                  name="confirmNewPassword" 
                  value={forgotPasswordForm.confirmNewPassword} 
                  onChange={handleForgotPasswordChange} 
                  required 
                />
              </label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className="btn green"
                >
                  Update Password
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(false)}
                  className="btn"
                  style={{ background: '#f5f5f5', color: '#666' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

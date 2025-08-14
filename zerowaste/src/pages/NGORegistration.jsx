import { useState } from 'react';
import { createNGO } from '../services/firestore';

export default function NGORegistration() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    serviceArea: '',
    capacity: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters and include a number.';
    if (!/[a-zA-Z]/.test(password)) return 'Password must be at least 8 characters and include a number.';
    if (!/\d/.test(password)) return 'Password must be at least 8 characters and include a number.';
    return '';
  };

  const validatePhone = (phone) => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it's exactly 10 digits (Indian format)
    if (digitsOnly.length !== 10) {
      return 'Enter a valid 10-digit mobile number.';
    }
    
    // Check if it starts with a valid Indian mobile prefix
    const validPrefixes = ['6', '7', '8', '9'];
    if (!validPrefixes.includes(digitsOnly[0])) {
      return 'Enter a valid 10-digit mobile number.';
    }
    
    return '';
  };

  const checkEmailExists = (email) => {
    const existingUsers = JSON.parse(localStorage.getItem('zerowaste_users') || '[]');
    return existingUsers.some(user => user.email === email);
  };

  const validateForm = () => {
    const errors = {};
    
    // Check required fields
    if (!form.name.trim()) errors.name = 'NGO Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    if (!form.confirmPassword) errors.confirmPassword = 'Confirm Password is required';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    if (!form.serviceArea.trim()) errors.serviceArea = 'Service Area is required';
    if (!form.capacity) errors.capacity = 'Daily Capacity is required';
    
    // Validate email format
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Check email uniqueness
    if (form.email && checkEmailExists(form.email)) {
      errors.email = 'This email is already in use. Please log in with this email or register using another email.';
    }
    
    // Validate password
    if (form.password) {
      const passwordError = validatePassword(form.password);
      if (passwordError) errors.password = passwordError;
    }
    
    // Check password match
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    
    // Validate phone
    if (form.phone.trim()) {
      const phoneError = validatePhone(form.phone);
      if (phoneError) errors.phone = phoneError;
    }

    // Validate capacity
    if (form.capacity) {
      const capacityError = validateCapacity(form.capacity);
      if (capacityError) errors.capacity = capacityError;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCapacity = (capacity) => {
    if (isNaN(capacity) || parseInt(capacity) <= 0) {
      return 'Capacity must be a positive number';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear aggregated error when user starts typing
    if (error && name !== 'phone' && name !== 'serviceArea' && name !== 'capacity') {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Simple password hashing for demo (in production, use proper hashing)
      const hashedPassword = btoa(form.password); // Base64 encoding for demo
      
      const registrationData = {
        ...form,
        password: hashedPassword,
        role: 'ngo'
      };
      
      // Remove confirmPassword from data to be stored
      delete registrationData.confirmPassword;
      
      await createNGO(registrationData);
      setSuccess(true);
      setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '', serviceArea: '', capacity: '' });
      setFieldErrors({});
      setError('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to register NGO');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return form.name.trim() && 
           form.email.trim() && 
           form.password && 
           form.confirmPassword && 
           form.phone.trim() && 
           form.serviceArea.trim() &&
           form.capacity &&
           form.password === form.confirmPassword &&
           validatePassword(form.password) === '' &&
           validatePhone(form.phone) === '' &&
           validateCapacity(form.capacity) === '';
  };

  return (
    <div className="container">
      <div className="form-layout">
        <div className="form-info">
          <h1>Register as NGO</h1>
          <p>Join our network of NGOs and help distribute food to those who need it most.</p>
          <ul>
            <li>Access surplus food from local donors</li>
            <li>Serve more people in your community</li>
            <li>Track your food distribution impact</li>
            <li>Connect with verified food donors</li>
          </ul>
        </div>
        
        <div className="form-content">
          <h2>NGO Registration</h2>
          <p>Register your NGO to receive and distribute surplus food.</p>
          
          {success && (
            <div className="success">
              <h3>Registration successful!</h3>
              <p>You can now log in using your email and password.</p>
              <p>Redirecting to login page in 3 seconds...</p>
              <button 
                className="btn green" 
                onClick={() => window.location.href = '/login'}
              >
                Go to Login Now
              </button>
            </div>
          )}
          
          <form className="form" onSubmit={handleSubmit}>
            <label>
              <span>NGO Name *</span>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className={fieldErrors.name ? 'error-field' : ''}
              />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </label>
            
            <label>
              <span>Email *</span>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
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
                placeholder="Minimum 8 characters, 1 letter, 1 number"
                className={fieldErrors.password ? 'error-field' : ''}
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </label>
            
            <label>
              <span>Confirm Password *</span>
              <input 
                type="password" 
                name="confirmPassword" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                required 
                className={fieldErrors.confirmPassword ? 'error-field' : ''}
              />
              {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
            </label>
            
            <label>
              <span>Phone *</span>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                placeholder="10-digit Indian mobile number"
                className={fieldErrors.phone ? 'error-field' : ''}
              />
              {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
            </label>
            
            <label>
              <span>Service Area *</span>
              <input 
                name="serviceArea" 
                value={form.serviceArea} 
                onChange={handleChange} 
                required 
                className={fieldErrors.serviceArea ? 'error-field' : ''}
              />
              {fieldErrors.serviceArea && <span className="field-error">{fieldErrors.serviceArea}</span>}
            </label>
            
            <label>
              <span>Daily Capacity (meals) *</span>
              <input 
                name="capacity" 
                value={form.capacity} 
                onChange={handleChange} 
                required 
                className={fieldErrors.capacity ? 'error-field' : ''}
              />
              {fieldErrors.capacity && <span className="field-error">{fieldErrors.capacity}</span>}
              <small className="capacity-info">
                Capacity means the number of people you can feed in a day.
              </small>
            </label>
            
            <button 
              className="btn green" 
              type="submit" 
              disabled={submitting || !isFormValid()}
            >
              {submitting ? 'Submitting…' : 'Register'}
            </button>
            
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
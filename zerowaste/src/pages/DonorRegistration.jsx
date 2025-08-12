import { useState } from 'react';
import { createDonor } from '../services/firestore';

export default function DonorRegistration() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    capacity: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createDonor(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', address: '', capacity: '' });
    } catch (err) {
      setError(err.message || 'Failed to register donor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container narrow">
      <h2>Donor Registration</h2>
      <p>Register your organization or household to contribute surplus food.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={handleChange} />
        </label>
        <label>
          Daily Capacity (meals)
          <input name="capacity" value={form.capacity} onChange={handleChange} />
        </label>
        <button className="btn saffron" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Register'}
        </button>
        {success && <div className="success">Thank you! Registered successfully.</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
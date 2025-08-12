import { useState } from 'react';
import { createNGO } from '../services/firestore';

export default function NGORegistration() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceArea: '',
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
      await createNGO(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', serviceArea: '', capacity: '' });
    } catch (err) {
      setError(err.message || 'Failed to register NGO');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container narrow">
      <h2>NGO Registration</h2>
      <p>Register your NGO to collect and distribute surplus food.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          NGO Name
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
          Service Area
          <input name="serviceArea" value={form.serviceArea} onChange={handleChange} />
        </label>
        <label>
          Capacity (meals/day)
          <input name="capacity" value={form.capacity} onChange={handleChange} />
        </label>
        <button className="btn green" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Register'}
        </button>
        {success && <div className="success">Thanks! Your NGO is registered.</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
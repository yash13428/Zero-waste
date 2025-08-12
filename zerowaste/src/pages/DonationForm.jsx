import { useState } from 'react';
import { createDonation } from '../services/firestore';

function estimateMeals(quantity, unit) {
  const q = Number(quantity) || 0;
  if (unit === 'servings') return Math.max(0, Math.round(q));
  // Assume 1 kg ~ 3 meals (simple heuristic)
  return Math.max(0, Math.round(q * 3));
}

export default function DonationForm() {
  const [form, setForm] = useState({
    donorName: '',
    contactMethod: 'whatsapp',
    contactValue: '',
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiry: '',
    pickupLocation: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState('');
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
      const estimatedMeals = estimateMeals(form.quantity, form.unit);
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        estimatedMeals,
        expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
      };
      const ref = await createDonation(payload);
      setSuccessId(ref.id);
      setForm({
        donorName: '', contactMethod: 'whatsapp', contactValue: '', foodType: '', quantity: '', unit: 'kg', expiry: '', pickupLocation: '', notes: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to post donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container narrow">
      <h2>Post Surplus Food</h2>
      <p>Share details of your surplus food so NGOs can collect it promptly.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Donor Name
          <input name="donorName" value={form.donorName} onChange={handleChange} required />
        </label>
        <div className="row two">
          <label>
            Contact Method
            <select name="contactMethod" value={form.contactMethod} onChange={handleChange}>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </label>
          <label>
            Contact (Phone or Email)
            <input name="contactValue" value={form.contactValue} onChange={handleChange} required />
          </label>
        </div>
        <div className="row two">
          <label>
            Food Type
            <input name="foodType" value={form.foodType} onChange={handleChange} required />
          </label>
          <label>
            Quantity
            <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} required />
          </label>
        </div>
        <div className="row two">
          <label>
            Unit
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="servings">servings</option>
            </select>
          </label>
          <label>
            Estimated Meals
            <input readOnly value={estimateMeals(form.quantity, form.unit)} />
          </label>
        </div>
        <div className="row two">
          <label>
            Expiry (date & time)
            <input type="datetime-local" name="expiry" value={form.expiry} onChange={handleChange} />
          </label>
          <label>
            Pickup Location
            <input name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Notes
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </label>
        <button className="btn saffron" type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post Donation'}
        </button>
        {successId && <div className="success">Donation posted! ID: {successId}</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
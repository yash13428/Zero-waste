import { useState, useEffect } from 'react';
import { createDonation } from '../services/firestore';

function estimateMeals(quantity, unit) {
  const q = Number(quantity) || 0;
  if (unit === 'servings') return Math.max(0, Math.round(q));
  // Assume 1 kg ~ 3 meals (simple heuristic)
  return Math.max(0, Math.round(q * 3));
}

// Generate time slots with timezone handling
function generateTimeSlots(pickupDate) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  
  const timeSlots = [];
  for (let hour = 7; hour <= 23; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    const isDisabled = pickupDate === today && hour <= currentHour;
    
    timeSlots.push({
      value: `${startTime}-${endTime}`,
      label: `${startTime}–${endTime}`,
      disabled: isDisabled
    });
  }
  
  return timeSlots;
}

export default function DonationForm() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    feederName: '',
    contactMethod: 'whatsapp',
    contactValue: '',
    foodType: '',
    foodTypeOther: '',
    ingredients: '',
    quantity: '',
    unit: 'kg',
    pickupDate: '',
    pickupTime: '',
    expiry: '',
    pickupLocation: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [error, setError] = useState('');

  // Load user data and prefill form
  useEffect(() => {
    const savedUser = localStorage.getItem('zerowaste_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Prefill form with user data
      setForm(prev => ({
        ...prev,
        feederName: userData.name || '',
        contactValue: userData.phone || userData.email || '',
        pickupLocation: userData.address || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Validate pickup date
    if (form.pickupDate) {
      const pickupDate = new Date(form.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (pickupDate < today) {
        setError('Pickup date cannot be in the past.');
        setSubmitting(false);
        return;
      }
    }
    
    try {
      const estimatedMeals = estimateMeals(form.quantity, form.unit);
      const finalFoodType = form.foodType === 'Other' ? form.foodTypeOther : form.foodType;
      
      const payload = {
        ...form,
        foodType: finalFoodType,
        quantity: Number(form.quantity),
        estimatedMeals,
        expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
      };
      await createDonation(payload);
      
      // Show success toast
      setShowSuccessToast(true);
      
      // Reset form
      setForm({
        feederName: user?.name || '',
        contactMethod: 'whatsapp',
        contactValue: user?.phone || user?.email || '',
        foodType: '',
        foodTypeOther: '',
        ingredients: '',
        quantity: '',
        unit: 'kg',
        pickupDate: '',
        pickupTime: '',
        expiry: '',
        pickupLocation: user?.address || '',
        notes: '',
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to post donation');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = generateTimeSlots(form.pickupDate);

  return (
    <div className="container narrow">
      <h2>Share a Meal</h2>
      <p>Share details of your surplus food so NGOs can collect it promptly.</p>
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="success-toast">
          Thanks! Your meal has been posted.
        </div>
      )}
      
      <form className="form" onSubmit={handleSubmit}>
        {/* Food Type */}
        <label>
          <span>Food Type *</span>
          <select name="foodType" value={form.foodType} onChange={handleChange} required>
            <option value="">Select Food Type</option>
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Packaged Food">Packaged Food</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Beverages">Beverages</option>
            <option value="Bakery Items">Bakery Items</option>
            <option value="Other">Other</option>
          </select>
        </label>
        
        {form.foodType === 'Other' && (
          <label>
            <span>Specify Food Type *</span>
            <input 
              name="foodTypeOther" 
              value={form.foodTypeOther}
              onChange={handleChange}
              placeholder="Please specify the food type"
              required
            />
          </label>
        )}
        
        {/* Quantity and Unit */}
        <div className="row two">
          <label>
            <span>Quantity *</span>
            <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} required />
          </label>
          <label>
            <span>Unit *</span>
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="servings">servings</option>
              <option value="boxes">boxes</option>
              <option value="meals">meals</option>
            </select>
          </label>
        </div>
        
        {/* Estimated Meals */}
        <label>
          <span>Estimated Meals</span>
          <input readOnly value={estimateMeals(form.quantity, form.unit)} />
        </label>
        
        {/* Ingredients */}
        <label>
          <span>Ingredients (Optional)</span>
          <textarea 
            name="ingredients" 
            value={form.ingredients}
            onChange={handleChange}
            placeholder="List ingredients or allergens..."
          />
        </label>
        
        {/* Pickup Date and Time */}
        <div className="row two">
          <label>
            <span>Pickup Date *</span>
            <input 
              type="date" 
              name="pickupDate" 
              value={form.pickupDate} 
              onChange={handleChange} 
              min={new Date().toISOString().split('T')[0]}
              required 
            />
          </label>
          <label>
            <span>Pickup Time *</span>
            <select name="pickupTime" value={form.pickupTime} onChange={handleChange} required>
              <option value="">Select Pickup Time</option>
              {timeSlots.map(slot => (
                <option key={slot.value} value={slot.value} disabled={slot.disabled}>
                  {slot.disabled ? `${slot.label} (Past)` : slot.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        {/* Expiry and Pickup Location */}
        <div className="row two">
          <label>
            <span>Expiry (date & time)</span>
            <input type="datetime-local" name="expiry" value={form.expiry} onChange={handleChange} />
          </label>
          <label>
            <span>Pickup Location *</span>
            <input name="pickupLocation" value={form.pickupLocation} onChange={handleChange} required />
          </label>
        </div>
        
        {/* Notes */}
        <label>
          <span>Notes</span>
          <textarea name="notes" value={form.notes} onChange={handleChange} />
        </label>
        
        <button className="btn saffron" type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Share a Meal'}
        </button>
        
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
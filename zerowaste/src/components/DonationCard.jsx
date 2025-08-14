import { format } from 'date-fns';

export default function DonationCard({ donation, onClaim, isClaiming, userRole, activeTab }) {
  const { id, donorName, contactMethod, contactValue, foodType, quantity, unit, estimatedMeals, expiry, pickupLocation, createdAt, status = 'Available', claimedBy } = donation;

  // Handle edge cases for contact links
  const whatsappLink = contactMethod === 'whatsapp' && contactValue ? `https://wa.me/${contactValue.replace(/\D/g, '')}` : null;
  const emailLink = contactMethod === 'email' && contactValue ? `mailto:${contactValue}` : null;

  // Handle date formatting with error handling
  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return '';
      const date = dateValue.seconds ? new Date(dateValue.seconds * 1000) : new Date(dateValue);
      return format(date, 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const expiryText = formatDate(expiry);
  const createdText = createdAt ? formatDate(createdAt) : 'Just now';

  // Handle missing or invalid data
  const safeQuantity = quantity || 0;
  const safeUnit = unit || 'kg';
  const safeEstimatedMeals = estimatedMeals || Math.round(safeQuantity * 3);
  const safeFoodType = foodType || 'Food';
  const safePickupLocation = pickupLocation || 'Location not specified';
  const safeDonorName = donorName || 'Anonymous';

  // Determine if claim button should be shown
  const showClaimButton = userRole === 'ngo' && status === 'Available' && activeTab === 'available';

  return (
    <div className={`donation-card ${isClaiming === id ? 'loading' : ''}`}>
      <div className="donation-card-header">
        <div className="badge" title={safeFoodType}>
          {safeFoodType.length > 15 ? `${safeFoodType.substring(0, 15)}...` : safeFoodType}
        </div>
        <div className={`status ${status.toLowerCase()}`}>
          {status}
        </div>
      </div>
      <div className="donation-card-body">
        <div className="row">
          <strong>Quantity:</strong> {safeQuantity} {safeUnit} (~{safeEstimatedMeals} meals)
        </div>
        <div className="row">
          <strong>Pickup:</strong> {safePickupLocation}
        </div>
        {expiryText && (
          <div className="row">
            <strong>Expiry:</strong> {expiryText}
          </div>
        )}
        <div className="row">
          <strong>Donor:</strong> {safeDonorName}
        </div>
        {status === 'Claimed' && claimedBy && (
          <div className="row">
            <strong>Claimed by:</strong> {claimedBy.name}
          </div>
        )}
        <div className="row subtle">Posted: {createdText}</div>
      </div>
      <div className="donation-card-actions">
        {whatsappLink && (
          <a
            className="btn whatsapp"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            title="Contact via WhatsApp"
          >
            WhatsApp
          </a>
        )}
        {emailLink && (
          <a
            className="btn email"
            href={emailLink}
            title="Contact via Email"
          >
            Email
          </a>
        )}
        {showClaimButton && (
          <button
            className="btn claim"
            onClick={() => onClaim(id, donation)}
            disabled={isClaiming === id}
            title="Claim this donation"
          >
            {isClaiming === id ? (
              <>
                <span className="loading"></span>
                Claiming...
              </>
            ) : (
              'Claim'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
import { format } from 'date-fns';

export default function DonationCard({ donation, onClaim }) {
  const {
    id,
    donorName,
    contactMethod,
    contactValue,
    foodType,
    quantity,
    unit,
    estimatedMeals,
    expiry,
    pickupLocation,
    createdAt,
  } = donation;

  const whatsappLink = contactMethod === 'whatsapp' && contactValue
    ? `https://wa.me/${contactValue.replace(/\D/g, '')}`
    : null;
  const emailLink = contactMethod === 'email' && contactValue
    ? `mailto:${contactValue}`
    : null;

  const expiryText = expiry ? new Date(expiry.seconds ? expiry.seconds * 1000 : expiry).toString() : '';
  const createdText = createdAt?.seconds ? format(new Date(createdAt.seconds * 1000), 'PPpp') : 'Just now';

  return (
    <div className="donation-card">
      <div className="donation-card-header">
        <div className="badge">{foodType}</div>
        <div className="status available">Available</div>
      </div>
      <div className="donation-card-body">
        <div className="row"><strong>Quantity:</strong> {quantity} {unit} (~{estimatedMeals} meals)</div>
        <div className="row"><strong>Pickup:</strong> {pickupLocation}</div>
        {expiry && <div className="row"><strong>Expiry:</strong> {format(new Date(expiry.seconds ? expiry.seconds * 1000 : expiry), 'PPpp')}</div>}
        <div className="row"><strong>Donor:</strong> {donorName}</div>
        <div className="row subtle">Posted: {createdText}</div>
      </div>
      <div className="donation-card-actions">
        {whatsappLink && (
          <a className="btn whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp</a>
        )}
        {emailLink && (
          <a className="btn email" href={emailLink}>Email</a>
        )}
        <button className="btn claim" onClick={() => onClaim(id, donation)}>Claim</button>
      </div>
    </div>
  );
}
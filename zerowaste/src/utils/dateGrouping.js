import { format, isToday, isYesterday } from 'date-fns';

// Group donations by date and sort by status
export function groupDonationsByDate(donations) {
  const grouped = {};
  
  donations.forEach(donation => {
    const createdAt = donation.createdAt?.seconds 
      ? new Date(donation.createdAt.seconds * 1000)
      : new Date(donation.createdAt || Date.now());
    
    const dateKey = format(createdAt, 'yyyy-MM-dd');
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: createdAt,
        dateLabel: getDateLabel(createdAt),
        donations: []
      };
    }
    
    grouped[dateKey].donations.push(donation);
  });
  
  // Sort donations within each group: Active first, then Inactive
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey].donations.sort((a, b) => {
      const aStatus = getStatusPriority(a.status);
      const bStatus = getStatusPriority(b.status);
      return aStatus - bStatus;
    });
  });
  
  // Sort date groups: newest first
  const sortedGroups = Object.values(grouped).sort((a, b) => b.date - a.date);
  
  return sortedGroups;
}

// Get human-readable date label
function getDateLabel(date) {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
}

// Get status priority for sorting (lower number = higher priority)
function getStatusPriority(status) {
  switch (status) {
    case 'Available':
      return 1; // Active - highest priority
    case 'Claimed':
      return 2; // BOOKED
    case 'Expired':
      return 3; // EXPIRED
    case 'Cancelled':
      return 4; // CANCELLED
    default:
      return 5; // Unknown status - lowest priority
  }
}

// Check if donation is active (available for booking)
export function isDonationActive(donation) {
  return donation.status === 'Available';
}

// Check if donation is inactive (booked, expired, or cancelled)
export function isDonationInactive(donation) {
  return donation.status !== 'Available';
}

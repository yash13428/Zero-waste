import { collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, doc, updateDoc, setDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

// Collections
const donorsCol = collection(db, 'donors');
const ngosCol = collection(db, 'ngos');
const donationsCol = collection(db, 'donations');
const statsDocRef = doc(db, 'stats', 'global');

// Donors
export async function createDonor(donor) {
  // Store user data in localStorage for demo (in production, this would be in Firestore)
  const existingUsers = JSON.parse(localStorage.getItem('zerowaste_users') || '[]');
  const newUser = {
    ...donor,
    createdAt: new Date().toISOString(),
  };
  existingUsers.push(newUser);
  localStorage.setItem('zerowaste_users', JSON.stringify(existingUsers));
  
  // Also store in Firestore for the original functionality
  return addDoc(donorsCol, {
    ...donor,
    createdAt: serverTimestamp(),
  });
}

// NGOs
export async function createNGO(ngo) {
  // Store user data in localStorage for demo (in production, this would be in Firestore)
  const existingUsers = JSON.parse(localStorage.getItem('zerowaste_users') || '[]');
  const newUser = {
    ...ngo,
    createdAt: new Date().toISOString(),
  };
  existingUsers.push(newUser);
  localStorage.setItem('zerowaste_users', JSON.stringify(existingUsers));
  
  // Also store in Firestore for the original functionality
  return addDoc(ngosCol, {
    ...ngo,
    createdAt: serverTimestamp(),
  });
}

// Donations
export async function createDonation(donation) {
  return addDoc(donationsCol, {
    ...donation,
    status: 'Available',
    createdAt: serverTimestamp(),
  });
}

export function subscribeAvailableDonations(onUpdate) {
  const q = query(donationsCol, where('status', '==', 'Available'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, onUpdate);
}

export function subscribeAllDonations(onUpdate) {
  const q = query(donationsCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, onUpdate);
}

export function subscribeClaimedDonations(onUpdate) {
  const q = query(donationsCol, where('status', '==', 'Claimed'), orderBy('claimedAt', 'desc'));
  return onSnapshot(q, onUpdate);
}

export async function claimDonation(donationId, claimInfo) {
  const donationRef = doc(db, 'donations', donationId);
  // Update donation with claim info and status
  await updateDoc(donationRef, {
    status: 'Claimed',
    claimedAt: serverTimestamp(),
    claimedBy: claimInfo,
  });

  // Increment meals served counter using estimatedMeals
  const donationSnap = await getDoc(donationRef);
  const estimatedMeals = donationSnap.exists() && donationSnap.data().estimatedMeals ? donationSnap.data().estimatedMeals : 1;

  await setDoc(statsDocRef, { mealsServed: increment(estimatedMeals) }, { merge: true });
}

// Stats
export function subscribeMealsServed(onUpdate) {
  return onSnapshot(statsDocRef, onUpdate);
}

export async function initStatsIfMissing() {
  const snap = await getDoc(statsDocRef);
  if (!snap.exists()) {
    await setDoc(statsDocRef, { mealsServed: 0 });
  }
}
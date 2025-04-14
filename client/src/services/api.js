// client/src/services/api.js

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// ========================
// PHYSICIAN ENDPOINTS (Your existing code)
// ========================
export const fetchPhysicians = async () => {
  const response = await fetch(`${API_BASE_URL}/physicians`);
  if (!response.ok) throw new Error('Failed to fetch physicians');
  return response.json();
};

export const fetchPhysicianById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/physicians/${id}`);
  if (!response.ok) throw new Error(`Physician ${id} not found`);
  return response.json();
};

export const createPhysician = async (physicianData) => {
  const response = await fetch(`${API_BASE_URL}/physicians`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(physicianData)
  });
  if (!response.ok) throw new Error('Physician creation failed');
  return response.json();
};

// ... (keep all your existing physician endpoints as-is)

// ========================
// ENHANCED REFERRAL ENDPOINTS 
// (New additions matching your backend)
// ========================
export const fetchReferrals = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/referrals?${queryString}`);
  if (!response.ok) throw new Error('Failed to load referrals');
  return response.json();
};

export const createReferral = async (referralData) => {
  const response = await fetch(`${API_BASE_URL}/referrals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient_name: referralData.patientName,
      patient_dob: referralData.dob,
      physician_id: referralData.physicianId,
      therapy_type: referralData.therapyType,
      clinic_location: referralData.location,
      notes: referralData.notes
    })
  });
  if (!response.ok) throw new Error('Referral submission failed');
  return response.json();
};

export const updateReferralStatus = async (id, newStatus) => {
  const response = await fetch(`${API_BASE_URL}/referrals/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (!response.ok) throw new Error('Status update failed');
  return response.json();
};

// ========================
// UTILITY FUNCTIONS
// ========================
export const fetchPhysiciansWithReferrals = async () => {
  const [physicians, referrals] = await Promise.all([
    fetchPhysicians(),
    fetchReferrals()
  ]);
  
  return physicians.map(physician => ({
    ...physician,
    referrals: referrals.filter(r => r.physician_id === physician.id)
  }));
};

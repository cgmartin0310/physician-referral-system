// client/src/services/api.js

// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend uses a different port

// Physician Endpoints
export const fetchPhysicians = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/physicians`);
    if (!response.ok) {
      throw new Error('Failed to fetch physicians');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching physicians:', error);
    throw error;
  }
};

export const fetchPhysicianById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/physicians/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch physician');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching physician ${id}:`, error);
    throw error;
  }
};

export const createPhysician = async (physicianData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/physicians`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(physicianData),
    });
    if (!response.ok) {
      throw new Error('Failed to create physician');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating physician:', error);
    throw error;
  }
};

export const updatePhysician = async (id, physicianData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/physicians/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(physicianData),
    });
    if (!response.ok) {
      throw new Error('Failed to update physician');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating physician ${id}:`, error);
    throw error;
  }
};

export const deletePhysician = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/physicians/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete physician');
    }
    return true; // Success
  } catch (error) {
    console.error(`Error deleting physician ${id}:`, error);
    throw error;
  }
};

// Referral Endpoints (existing)
export const fetchReferrals = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals`);
    if (!response.ok) {
      throw new Error('Failed to fetch referrals');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching referrals:', error);
    throw error;
  }
};

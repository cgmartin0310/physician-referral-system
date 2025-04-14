// src/App.js
import React, { useState, useEffect } from 'react';
import ReferralsTable from './components/ReferralsTable';
import { Alert, CircularProgress, Container } from '@mui/material';

function App() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch('/api/referrals');
        if (!response.ok) throw new Error('Network response failed');
        const data = await response.json();
        setReferrals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <h1>Physician Referral System</h1>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load referrals: {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <ReferralsTable referrals={referrals} />
      )}
    </Container>
  );
}

export default App;

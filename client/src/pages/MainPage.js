import React, { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import ReferralsGrid from '../components/ReferralsGrid';
import PhysiciansTable from '../components/PhysiciansTable';

export default function MainPage() {
  const [showPhysicians, setShowPhysicians] = useState(false);

  return (
    <Container maxWidth="lg" style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom>
        Physician Referral System
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={() => setShowPhysicians(!showPhysicians)}
        style={{ marginBottom: '20px' }}
      >
        {showPhysicians ? 'Show Referrals' : 'Show Physicians'}
      </Button>

      {showPhysicians ? <PhysiciansTable /> : <ReferralsGrid />}
    </Container>
  );
}

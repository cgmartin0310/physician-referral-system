import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { fetchReferrals } from '../services/api';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'patient_name', headerName: 'Patient', width: 150 },
  { field: 'therapy_type', headerName: 'Therapy', width: 150 },
];

export default function ReferralsGrid() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    fetchReferrals().then(data => setReferrals(data));
  }, []);

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={referrals}
        columns={columns}
        pageSize={10}
      />
    </div>
  );
}

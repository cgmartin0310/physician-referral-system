import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PhysiciansTable from './components/PhysiciansTable';
import ReferralsTable from './components/ReferralsTable';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Layout>
        <Routes>
          <Route path="/physicians" element={<PhysiciansTable />} />
          <Route path="/referrals" element={<ReferralsTable />} />
          <Route path="/" element={<PhysiciansTable />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;

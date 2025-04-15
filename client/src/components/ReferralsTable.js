import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function ReferralsTable() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch('/api/referrals', {
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if needed:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-alert">Error: {error}</div>;

  return (
    <div className="table-responsive">
      <table className="referral-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Referring MD</th>
            <th>Referred To</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {referrals.length > 0 ? (
            referrals.map((referral) => (
              <tr key={`${referral.id}-${referral.date}`}>
                <td>{referral.patientName}</td>
                <td>{referral.referringPhysician}</td>
                <td>{referral.referredTo}</td>
                <td>{new Date(referral.date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${referral.status.toLowerCase()}`}>
                    {referral.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-referrals">
                No referrals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

ReferralsTable.propTypes = {
  referrals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      patientName: PropTypes.string.isRequired,
      referringPhysician: PropTypes.string.isRequired,
      referredTo: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      status: PropTypes.oneOf(['Pending', 'Completed', 'Cancelled']).isRequired,
    })
  ),
};

export default ReferralsTable;

require('dotenv').config();
const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Configuration (unchanged)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/yourdb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test DB connection (unchanged)
(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('🚀 PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.stack);
    process.exit(1);
  }
})();

// Middleware (unchanged)
app.use(express.json());

// ========================
// NEW: Add CORS support
// ========================
const cors = require('cors');
app.use(cors());

// ========================
// NEW: Referral Listing Endpoint 
// (Matches your exact schema)
// ========================
app.get('/api/referrals', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.patient_name,
        r.patient_dob,
        r.patient_phone,
        r.referral_date,
        r.status,
        r.therapy_type,
        r.clinic_location,
        r.notes,
        p.full_name AS physician_name,
        p.specialty AS physician_specialty
      FROM referrals r
      JOIN physicians p ON r.physician_id = p.id
      ORDER BY r.referral_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ Referral fetch error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch referrals',
      details: err.message 
    });
  }
});

// Existing health check (unchanged)
app.get('/api/health', async (req, res) => {
  /* ... existing code ... */
});

// Existing POST endpoint (unchanged)
app.post('/api/referrals', async (req, res) => {
  /* ... existing code ... */
});

// Error Handling (unchanged)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server (unchanged)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown (unchanged)
process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('PostgreSQL pool closed');
    process.exit(0);
  });
});

require('dotenv').config(); // Load .env locally (not needed on Render)
const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/yourdb',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test DB connection on startup
(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('🚀 PostgreSQL connected');
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.stack);
    process.exit(1);
  }
})();

// Middleware
app.use(express.json());

// Routes
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1'); // Simple query to verify DB
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({ 
      status: 'unhealthy',
      error: err.message 
    });
  }
});

// Example CRUD Endpoint
app.post('/api/referrals', async (req, res) => {
  try {
    const { patient_id, physician_id, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO referrals (patient_id, physician_id, notes) 
       VALUES ($1, $2, $3) RETURNING *`,
      [patient_id, physician_id, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('PostgreSQL pool closed');
    process.exit(0);
  });
});

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'admin', -- 'super_admin', 'admin', 'viewer'
        full_name VARCHAR(200),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,

        -- Personal info
        title VARCHAR(50),                          -- ማእረግ
        first_name VARCHAR(100) NOT NULL,           -- ስም
        father_name VARCHAR(100) NOT NULL,          -- የአባት ስም
        grandfather_name VARCHAR(100),              -- የአያት ስም
        date_of_birth DATE,                         -- የትዉልድ ቀን
        gender VARCHAR(10),                         -- ጾታ

        -- Origin
        region VARCHAR(100),                        -- የተወለዱበት ክልል
        zone VARCHAR(100),                          -- ዞን
        woreda VARCHAR(100),                        -- ወረዳ
        center VARCHAR(100),                        -- ማእከል

        -- Spiritual
        baptism_name VARCHAR(100),                  -- የክርስትና ስም
        confession_father VARCHAR(150),             -- የንስሐ አባት

        -- University
        university_department VARCHAR(150),         -- ዲፓርትመንት
        batch VARCHAR(20),                          -- ባች
        section VARCHAR(20),                        -- ሴክሽን

        -- Contact
        email VARCHAR(150),                         -- ኢሜይል
        phone VARCHAR(30),                          -- ስልክ ቁጥር

        -- Gubae
        gubae_department VARCHAR(100),              -- የሚያገለግሉበት ክፍል (one of 12 or leadership)
        joining_date DATE,                          -- የተቀበሉበት ቀን
        status VARCHAR(20) DEFAULT 'active',        -- 'active' or 'graduated'
        graduation_year VARCHAR(10),                -- ዓ.ም (if graduated)
        notes TEXT,                                 -- ማሳሰቢያ

        -- Photo
        photo_url VARCHAR(500),                     -- Cloudinary URL
        photo_public_id VARCHAR(300),               -- Cloudinary public_id (for deletion)

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
      CREATE INDEX IF NOT EXISTS idx_members_batch ON members(batch);
      CREATE INDEX IF NOT EXISTS idx_members_gubae_dept ON members(gubae_department);
    `);
    console.log('Database initialized.');
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };

require('dotenv').config();
const { Pool } = require('pg');

// Use production database URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateProduction() {
  try {
    console.log('🔧 Migrating production products table...');
    console.log('📊 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    // Add missing columns to products table
    const migrations = [
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS condition VARCHAR(50) DEFAULT \'excellent\'',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT \'Toronto, ON\'',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 9.99',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[]',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false',
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS end_date TIMESTAMP'
    ];

    for (const migration of migrations) {
      try {
        console.log(`🔄 Executing: ${migration}`);
        await pool.query(migration);
        console.log(`✅ Success: ${migration}`);
      } catch (error) {
        if (error.code === '42701') { // Column already exists
          console.log(`⏭️  Skipped (already exists): ${migration}`);
        } else {
          console.error(`❌ Failed: ${migration}`, error.message);
          throw error;
        }
      }
    }

    // Verify the columns exist
    console.log('🔍 Verifying columns...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current products table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default || 'none'})`);
    });

    console.log('🎉 Production migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Production migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateProduction();

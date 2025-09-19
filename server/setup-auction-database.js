require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupAuctionDatabase() {
  try {
    console.log('🔧 Setting up auction database tables...');

    // Create auctions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        category VARCHAR(100),
        starting_price DECIMAL(10,2) NOT NULL,
        current_price DECIMAL(10,2) NOT NULL,
        reserve_price DECIMAL(10,2),
        bid_increment DECIMAL(10,2) DEFAULT 1.00,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        winner_id INTEGER REFERENCES users(id),
        winning_bid DECIMAL(10,2),
        payment_status VARCHAR(20) DEFAULT 'pending',
        collection_status VARCHAR(20) DEFAULT 'pending',
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Auctions table created');

    // Create auction_bids table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auction_bids (
        id SERIAL PRIMARY KEY,
        auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        bid_amount DECIMAL(10,2) NOT NULL,
        bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_winning_bid BOOLEAN DEFAULT false,
        auto_bid_max DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Auction bids table created');

    // Create auction_notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auction_notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        sent_email BOOLEAN DEFAULT false,
        sent_sms BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Auction notifications table created');

    // Create auction_payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auction_payments (
        id SERIAL PRIMARY KEY,
        auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50),
        payment_status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(255),
        payment_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Auction payments table created');

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auctions_category ON auctions(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auction_bids_user_id ON auction_bids(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auction_bids_amount ON auction_bids(bid_amount)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auction_notifications_user_id ON auction_notifications(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_auction_notifications_type ON auction_notifications(type)');
    console.log('✅ Database indexes created');

    // Insert sample auction data
    const sampleAuctions = [
      {
        title: 'Flat-screen TV - 55" Samsung',
        description: 'Brand new Samsung 55" Smart TV, still in original packaging. Perfect for your living room or home theater setup.',
        category: 'Electronics',
        starting_price: 30.00,
        current_price: 30.00,
        reserve_price: 50.00,
        bid_increment: 5.00,
        start_time: new Date(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'active'
      },
      {
        title: 'Bulk Pallet: Kitchen & Home Items',
        description: 'Mystery pallet containing various kitchen and home items. Perfect for resellers or home improvement projects.',
        category: 'Home & Garden',
        starting_price: 50.00,
        current_price: 50.00,
        reserve_price: 100.00,
        bid_increment: 10.00,
        start_time: new Date(),
        end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'active'
      },
      {
        title: 'Designer Fashion Assortment',
        description: 'Collection of designer clothing items including dresses, shirts, and accessories. Various sizes and brands.',
        category: 'Fashion',
        starting_price: 20.00,
        current_price: 20.00,
        reserve_price: 40.00,
        bid_increment: 2.00,
        start_time: new Date(),
        end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'active'
      },
      {
        title: 'Mystery Tech Box',
        description: 'Mystery box containing various tech items. Could include phones, tablets, accessories, and more!',
        category: 'Electronics',
        starting_price: 15.00,
        current_price: 15.00,
        reserve_price: 30.00,
        bid_increment: 3.00,
        start_time: new Date(),
        end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'active'
      }
    ];

    for (const auction of sampleAuctions) {
      await pool.query(`
        INSERT INTO auctions (title, description, category, starting_price, current_price, reserve_price, bid_increment, start_time, end_time, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
      `, [
        auction.title,
        auction.description,
        auction.category,
        auction.starting_price,
        auction.current_price,
        auction.reserve_price,
        auction.bid_increment,
        auction.start_time,
        auction.end_time,
        auction.status,
        2 // Admin user ID
      ]);
    }
    console.log('✅ Sample auction data inserted');

    console.log('🎉 Auction database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Auction database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupAuctionDatabase();

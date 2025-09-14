require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Bid = require('./models/Bid');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Bid.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@moezbinz.com',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user');

    // Create regular users
    const users = [];
    const userData = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Mike Johnson', email: 'mike@example.com' },
      { name: 'Sarah Wilson', email: 'sarah@example.com' },
      { name: 'David Brown', email: 'david@example.com' }
    ];

    for (const userInfo of userData) {
      const password = await bcrypt.hash('password123', 10);
      const user = new User({
        name: userInfo.name,
        email: userInfo.email,
        password: password,
        role: 'user'
      });
      await user.save();
      users.push(user);
    }
    console.log('Created regular users');

    // Create sample products
    const products = [];
    const productData = [
      {
        name: 'Vintage Rolex Watch',
        description: 'Beautiful vintage Rolex watch in excellent condition',
        category: 'jewelry',
        startingPrice: 5000,
        condition: 'like-new',
        location: 'New York, NY',
        shippingCost: 50,
        tags: 'vintage, luxury, watch',
        isFeatured: true
      },
      {
        name: 'Antique Wooden Chair',
        description: 'Handcrafted antique wooden chair from the 1800s',
        category: 'home',
        startingPrice: 800,
        condition: 'good',
        location: 'Boston, MA',
        shippingCost: 75,
        tags: 'antique, furniture, wood',
        isFeatured: false
      },
      {
        name: 'Classic Guitar',
        description: 'Beautiful acoustic guitar perfect for beginners',
        category: 'other',
        startingPrice: 300,
        condition: 'good',
        location: 'Los Angeles, CA',
        shippingCost: 40,
        tags: 'music, guitar, acoustic',
        isFeatured: true
      },
      {
        name: 'Rare Book Collection',
        description: 'Collection of rare first edition books',
        category: 'books',
        startingPrice: 1200,
        condition: 'fair',
        location: 'Chicago, IL',
        shippingCost: 30,
        tags: 'books, rare, collection',
        isFeatured: false
      },
      {
        name: 'Vintage Camera',
        description: 'Professional vintage camera in working condition',
        category: 'electronics',
        startingPrice: 600,
        condition: 'good',
        location: 'Seattle, WA',
        shippingCost: 35,
        tags: 'camera, vintage, photography',
        isFeatured: true
      }
    ];

    for (const productInfo of productData) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 7); // 7-37 days from now

      const product = new Product({
        ...productInfo,
        currentPrice: productInfo.startingPrice,
        imageUrl: '/uploads/products/placeholder.jpg', // Placeholder image
        endDate: endDate,
        createdBy: admin._id,
        status: 'active'
      });
      await product.save();
      products.push(product);
    }
    console.log('Created sample products');

    // Create sample bids
    for (let i = 0; i < 15; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const bidAmount = randomProduct.startingPrice + Math.floor(Math.random() * 500) + 50;

      const bid = new Bid({
        product: randomProduct._id,
        bidder: randomUser._id,
        amount: bidAmount,
        status: 'active',
        isAutoBid: Math.random() > 0.7,
        bidTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
      });
      await bid.save();

      // Update product current price if this is the highest bid
      if (bidAmount > randomProduct.currentPrice) {
        randomProduct.currentPrice = bidAmount;
        await randomProduct.save();
      }
    }
    console.log('Created sample bids');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log('Admin User: admin@moezbinz.com / admin123');
    console.log('Regular Users: [email]@example.com / password123');
    console.log(`Total Users: ${await User.countDocuments()}`);
    console.log(`Total Products: ${await Product.countDocuments()}`);
    console.log(`Total Bids: ${await Bid.countDocuments()}`);
    console.log('========================\n');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedData();

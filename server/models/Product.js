const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'sold', 'expired'], 
    default: 'active' 
  },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  condition: { 
    type: String, 
    enum: ['new', 'like-new', 'good', 'fair', 'poor'], 
    required: true 
  },
  location: { type: String, required: true },
  shippingCost: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

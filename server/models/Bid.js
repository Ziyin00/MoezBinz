const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'outbid', 'winning', 'won', 'lost'], 
    default: 'active' 
  },
  isAutoBid: { type: Boolean, default: false },
  maxBidAmount: { type: Number }, // For auto-bidding
  bidTime: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
bidSchema.index({ product: 1, amount: -1 });
bidSchema.index({ bidder: 1 });

module.exports = mongoose.model('Bid', bidSchema);

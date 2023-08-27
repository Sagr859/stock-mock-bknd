const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  id            : Number,
  stockName     : String,
  price         : Number,
  currPrice     : Number,
  priceExc      : Number,
  priceRec      : [
    {
      dateText  : String,
      priceVal  : Number,
      priceDiff : Number
    }
  ]
});

const Stock = mongoose.model('stock', stockSchema);

module.exports = Stock;
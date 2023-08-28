require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Stock = require('./models/stock');
const predefinedStocks = require('./predefinedStocks')
const PORT = 8080

const app = express();
app.use(cors());

mongoose.connect(process.env.DATABASE_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

async function addPriceRecord(stockId, dateText, priceVal, priceDiff) {
  try {
    const stock = await Stock.findOne({ id: stockId });

    if (!stock) {
      console.log('Stock not found');
      return;
    }

    stock.priceRec.push({ dateText, priceVal, priceDiff });
    await stock.save();
    console.log('Price record added successfully');
  } catch (error) {
    console.error('Error adding price record:', error);
  }
}


app.get('/api/stocks', async (req, res) => {
    try {
      const stocks = await Stock.find();
            
      const stockData = stocks.map(stock =>{
        let newPrice = stock.price + Math.random() * 50 - 20
        let oldPriceArr = stock.priceRec
        let newPriceDiff = newPrice.toFixed(2) - stock.price
        let newObj = { 
          dateText  : `${oldPriceArr.length} min`,
          priceVal  : newPrice.toFixed(2),
          priceDiff : newPriceDiff.toFixed(2)
         }
        addPriceRecord(stock.id, newObj.dateText, newObj.priceVal, newObj.priceDiff)

        return({
          id        : stock.id,
          stockName : stock.stockName,
          price     : stock.price, 
          currPrice : newPrice.toFixed(2),
          priceExc  : newPrice.toFixed(2) - stock.price,
          priceRec  : stock.priceRec
        }) 
      });
      res.json(stockData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  async function populateInitialData() {
    try {
      await Stock.insertMany(predefinedStocks);
      console.log('Initial data populated');
    } catch (error) {
      console.error('Error populating initial data:', error);
    }
  }
  
  populateInitialData();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
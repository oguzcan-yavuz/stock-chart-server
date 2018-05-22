'use strict';

const rp = require('request-promise');
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

function parseStock(stock) {
  stock = JSON.parse(stock);
  return JSON.stringify({ symbol: stock["Meta Data"]["2. Symbol"], data: Object.entries(stock["Time Series (Daily)"]).map(day => {
    return { date: day[0], open: day[1]["1. open"], close: day[1]["4. close"]};
  })});
}

module.exports = (symbol) => {
  const options = {
    uri: "https://www.alphavantage.co/query",
    qs: {
      "function": "TIME_SERIES_DAILY",
      symbol: symbol.toUpperCase(),
      apikey: API_KEY
    }
  };
  return rp(options)
    .then(stock => parseStock(stock));
};

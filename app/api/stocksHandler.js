'use strict';

const rp = require('request-promise');
const Stocks = require('../models/stock.js');
const Deleted = require('../models/deleted.js');
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;


async function getStock(symbol) {
  let query = { 'stock.symbol': symbol };
  return Stocks.findOne(query);
}

async function getAllDeleted() {
  return Deleted.find();
}

async function getAllStocks() {
  let deleted = (await getAllDeleted()).map(deleted => deleted.deleted);
  return dbParser(await Stocks.find().where('stock.symbol').nin(deleted));
}

async function isDeleted(symbol) {
  let query = { deleted: symbol };
  return await Deleted.findOne(query) !== null;
}

async function isInserted(symbol) {
  return await getStock(symbol) !== null;
}

async function addStock(symbol) {
  if(!await isDeleted(symbol)) {
    if(!await isInserted(symbol)) {
      let stock = requestParser(await requestStock(symbol));
      if(stock.error)
        return;
      let doc = { stock: stock };
      return await Stocks.insertMany(doc);
    }
  } else
    return await undeleteStock(symbol);
}

async function deleteStock(symbol) {
  if(await isInserted(symbol) && !await isDeleted(symbol)) {
    let doc = { deleted: symbol };
    return Deleted.insertMany(doc);
  }
}

async function undeleteStock(symbol) {
  let query = { deleted: symbol };
  return Deleted.deleteOne(query);
}

async function updateStocks() {
  console.log("current date:", new Date());
  console.log("Updating the stocks...");
  // get current stocks
  let stocks = await getAllStocks();
  // reset the stocks
  await Stocks.remove({});
  // add the stocks which were inserted and not deleted
  await Promise.all(stocks.map(stock => addStock(stock.symbol)));
  // reset the deleted stocks
  await Deleted.remove({});
}

function dbParser(stocks) {
  return stocks.map(stock => stock.stock);
}

function requestParser(stock) {
  stock = JSON.parse(stock);
  if(stock["Error Message"])
    return { error: "Not found" };
  return {
    symbol: stock["Meta Data"]["2. Symbol"], data: Object.entries(stock["Time Series (Daily)"]).map(day => {
      return { date: day[0], open: day[1]["1. open"], close: day[1]["4. close"] };
    })
  };
}

function requestStock(symbol) {
  const options = {
    uri: "https://www.alphavantage.co/query",
    qs: {
      "function": "TIME_SERIES_DAILY",
      symbol: symbol.toUpperCase(),
      apikey: API_KEY
    }
  };
  return rp(options)
    .then(stock => stock);
}

function setUpdateStocks() {
  // calls the updateStocks function each day at 01:00 AM
  let now = new Date();
  let oneDay = 86400000;
  let millis = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 4, 0, 0, 0) - now;
  setTimeout(() => {
    updateStocks();
    setInterval(updateStocks, oneDay)
  }, millis);
}

setUpdateStocks();

module.exports = { addStock, deleteStock, getAllStocks };

'use strict';

const WebSocket = require('ws');
const stockHandler = require('../api/stocksHandler.js');

function broadcast(wss, data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

module.exports = (server) => {
  const wss = new WebSocket.Server({ server: server });
  wss.on('connection', async (ws) => {
    // send all stocks saved in db to the client at the initialization.
    broadcast(wss, JSON.stringify(await stockHandler.getAllStocks()));
    ws.on('message', async (data) => {
      // client will send an `operator` property inside of the data object. check it's value to decide ADD or DELETE
      data = JSON.parse(data);
      let symbol = data.symbol.toUpperCase(), operator = data.operator.toUpperCase();
      console.log('received data:', data);
      if(operator === 'ADD')
        await stockHandler.addStock(symbol);
      else if(operator === 'DELETE')
        await stockHandler.deleteStock(symbol);
      broadcast(wss, JSON.stringify(await stockHandler.getAllStocks()));
    });
  })
};

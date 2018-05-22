'use strict';

const WebSocket = require('ws');
const getStock = require('../api/getStock.js');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server: server });
  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      // when we got a message, check if the operator is ADD or DELETE.
      // if it's ADD, add the new symbol to the db and send all symbols(?) back to the client
      // if it's DELETE, delete the new symbol from the db and send all symbols(?) again to the client
      data = JSON.parse(data);
      console.log('received data:', data);
      if(data.operator === 'ADD') {
        let results = await getStock(data.symbol);
        ws.send(results);
      }
    });
    // send all stocks saved in db in here when connection established.
    ws.send(JSON.stringify({ message: 'Connection established!' }));
  })
};

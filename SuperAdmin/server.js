
const express = require('express');
const cds = require('@sap/cds');
const app = express();


cds.connect.to('db').then(async () => {
  await cds.server(app);
  
  app.listen(5000 ,
    () => {
    console.log(`Server running on port 5000`);
  });
}).catch(err => {
  console.error('Error connecting to the database:', err);
});

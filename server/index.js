const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()

console.log(process.env.DATABASE_URL)


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true,
    dbName: 'footballclubsinfo' })
mongoose.connection.once('open', function () {
    console.log('MongoDB running');
  })
  .on('error', function (err) {
    console.log(err);
  });

  app.use(express.json());

  const clubsRouter = require('./routes/clubs')

  app.use('/api/clubs', clubsRouter)

  
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
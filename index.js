const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool, Client } = require('pg');

const app = express();

dotenv.config({ path: '.env' });

const db = new Client({
  connectionString: process.env.URI,
});

db.connect()
  .then(() => console.log("CONNECTED TO DB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.use(morgan(':method :url :response-time'));
app.use(cors());
app.use(express.json());

app.use('/api/v1', require('./routes/api'));

app.use('/', (req, res, next) => {
  res.status(200).send('<h1 style="text-align: center">TEAMWORK API HOME</h1>');
  next();
});

app.listen(PORT, () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`);
});

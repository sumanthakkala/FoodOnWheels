const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('dotenv/config');

//Routes
const restaurantsRoute = require('./routes/restaurants')
const categoriesRoute = require('./routes/categories')

const app = express();
app.use(bodyParser.json())

app.use('/bucket/uploads', express.static('public/uploads'))
app.use('/api/restaurants', restaurantsRoute)
app.use('/api/categories', categoriesRoute)

mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => { console.log("Connected To DB!") })

app.listen(5000);
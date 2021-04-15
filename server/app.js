const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv/config');

//Routes
const restaurantsRoute = require('./routes/restaurants')
const categoriesRoute = require('./routes/categories')
const ordersRoute = require('./routes/orders')
const couponsRoute = require('./routes/coupons')

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.use('/bucket/uploads', express.static('public/uploads'))
app.use('/api/restaurants', restaurantsRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/orders', ordersRoute)
app.use('/api/coupons', couponsRoute)

mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, () => { console.log("Connected To DB!") })

app.listen(5000);
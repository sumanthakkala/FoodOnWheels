const express = require('express')
const router = express.Router()
const Restaurant = require('../models/Restaurant')

router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err });
    }
});


module.exports = router;
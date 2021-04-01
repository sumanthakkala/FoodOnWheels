const express = require('express')
const router = express.Router()
const Category = require('../models/Category')
const fs = require('fs')
require('dotenv/config');

const uploadHelper = require('../middleware/upload')




router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories)
    }
    catch (err) {
        res.json({ message: err });
    }
});

router.post('/', uploadHelper, async (req, res) => {
    const category = new Category({
        name: req.body.name,
        icon: process.env.BUCKET_ACCESS_PATH + req.file.filename
    });
    try {
        const savedCategory = await category.save();
        res.json(savedCategory)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})

router.delete('/:categoryId', async (req, res) => {
    try {
        const removedCategory = await Category.remove({ _id: req.params.categoryId })
    }
    catch (err) {
        res.json({ message: err })
    }
})


module.exports = router;
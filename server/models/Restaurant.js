const mongoose = require('mongoose')



const locationSubSchema = mongoose.Schema({
    // your subschema content
    latitude: {
        type: Number,
        default: 1.5347282806345879
    },
    longitude: {
        type: Number,
        default: 110.35632207358996
    },
}, { _id: false });

const RestaurantSchema = mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.8
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }],
    priceRating: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    location: [locationSubSchema],
    menu: [
        {
            name: {
                type: String,
            },
            photo: {
                type: String,
                required: true
            },
            description: {
                type: String,
            },
            calories: {
                type: Number,
            },
            price: {
                type: Number,
            }
        }
    ]
})



module.exports = mongoose.model('Restaurants', RestaurantSchema)
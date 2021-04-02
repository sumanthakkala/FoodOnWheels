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


const orderedMenuItemsSubSchema = mongoose.Schema({
    // your subschema content
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurants.menu'
    },
    qty: {
        type: Number,
    },
    price: {
        type: Number,
    },
    total: {
        type: Number,
    },
}, { _id: false });

const OrderSchema = mongoose.Schema({
    dateCreated: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        default: "dymmyuser"

    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurants'
    },
    orderTotal: {
        type: Number,
    },
    status: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: { type: locationSubSchema, default: () => ({}) },
    orderedMenu: [
        { type: orderedMenuItemsSubSchema, default: () => ({}) }
    ]
})



module.exports = mongoose.model('Orders', OrderSchema)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const http = require('http')
const socketio = require('socket.io')
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

const server = http.createServer(app)
const io = socketio(server)

// io.use((socket, next) => {
//     const orderId = socket.handshake.auth.orderId;
//     if (!orderId) {
//         return next(new Error("invalid username"));
//     }
//     socket.orderId = orderId;
//     next();
// });



io.on("connection", (socket) => {
    // ...
    // socket.on("location", (anotherSocketId, msg) => {
    //     socket.to(anotherSocketId).emit("private message", socket.id, msg);
    // });

    const socketId = socket.id
    var connectedUser = false

    socket.on('connectForLocationUpdates', (orderId) => {
        socket.isTrackee = true
        socket.orderId = orderId
        console.log({ socketId, orderId })
    })

    socket.on('connectForTracking', (orderId) => {
        // if (connectedUser) return;
        console.log({ socketId, orderId })
        for (let [id, socket] of io.of("/").sockets) {
            // console.log(io.of("/").sockets)
            if (socket.orderId === orderId && socket.isTrackee === true) {
                console.log(id)
                socket.emit('customerSocketDetails', { socketId, orderId })
                console.log('socket matched')
                break;
            }
        }

        // we store the username in the socket session for this client
        socket.orderId = orderId;
        socket.isTracker = true
        connectedUser = true;
    });

    socket.on('locationUpdated', (data) => {
        console.log('location updated')
        console.log(data)
        for (let [id, socket] of io.of("/").sockets) {
            // console.log(io.of("/").sockets)
            if (id === data.to && socket.isTracker === true) {
                console.log(id)
                socket.emit('locationUpdatedFromTrackee', data.location)
                break
            }
        }

        // console.log(io.sockets.sockets[data.to])
        // io.sockets.sockets[data.to].emit('locationUpdatedFromTrackee', data.location)

    })
});


server.listen(5000);
require('dotenv').config()
var cors = require('cors')
var amazon = require('./api/controllers/amazonController')
require('log-timestamp');
var admin = require("firebase-admin");

// Initialize Firebase
var serviceAccount = require("./track4deals-firebase-adminsdk-h07o4-64eee604e3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    Product = require('./api/models/productModel'), //created model loading here
    Tracking = require('./api/models/trackingModel'), //created model loading here
    UserInfo = require('./api/models/userInfoModel'), //created model loading here
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(
        () => { console.log('Connected to DB') },
        err => { console.log('ERROR connecting to db: ' + err) }
    );


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: true }));


var routes = require('./api/routes/trackRoutes');
routes(app);

app.listen(port);
console.log('track4Deals RESTful API server started on: ' + port);
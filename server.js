require('dotenv').config()
var cors = require('cors')
var amazon = require('./api/controllers/amazonController')
require('log-timestamp');
var admin = require("firebase-admin");

// Initialize Firebase
/*
var serviceAccount = require("./track4deals-firebase-adminsdk-h07o4-64eee604e3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
*/

admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
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
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(
        () => { console.log('Connected to DB') },
        err => { console.log('ERROR connecting to db: ' + err) }
    );


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.set('views', __dirname + '/api/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


var routes = require('./api/routes/trackRoutes');
routes(app);

app.listen(port);
console.log('track4Deals RESTful API server started on: ' + port);

require('dotenv').config()
var cors = require('cors')


var express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    mongoose = require('mongoose'),
    Plant = require('./api/models/plantModel'), //created model loading here
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(
        () => { console.log('Connected to DB') },
        err => { console.log('ERROR connecting to db: ' + err) }
    );


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors())


var routes = require('./api/routes/trackRoutes');
routes(app);

app.listen(port);
console.log('track4Deals RESTful API server started on: ' + port);
'use strict';
var admin = require("firebase-admin");
var defaultAuth = admin.auth();

var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Tracking = mongoose.model('Tracking');


exports.get_all_offers = (req, res) => {
    Product.find({}, (err, products) => {
        if (err)
            res.send(err);
        res.json(products);
    });
};

exports.get_tracking_offers = (req, res) => {
    if (err)
        res.send(err);
    res.json({ "ok": "true" });

};


exports.add_tracking_product = (req, res) => {
    if (err)
        res.send(err);
    res.json({ "ok": "true" });

};

exports.modify_profile = (req, res) => {
    if (err)
        res.send(err);
    res.json({ "ok": "true" });

};

exports.enable_notifications = async (req, res) => {
    const token = req.headers.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.update({ 'user_id': uid }, { $set: { 'firebaseToken': req.body.firebaseToken } }, () => {
        if (err)
            res.send(err);
        res.json({ "ok": "true" });
    });
};

exports.add_account = async (req, res) => {
    try {
        const { displayName, password, email } = req.body

        if (!displayName || !password || !email) {
            return res.status(400).send({ message: 'Missing fields' })
        }
        const { uid } = await defaultAuth.createUser({
            email: email,
            password: password,
            displayName: displayName
        });
        res.status(201).send({ registration: "ok", uid: uid })
    } catch (err) {
        console.log(`ERROR: ${err.code} - ${err.message}`);
        res.status(500).send({ registration: "error", message: `${err.code} - ${err.message}` });
    }

};


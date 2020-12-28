'use strict';
var admin = require("firebase-admin");
var defaultAuth = admin.auth();

var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Tracking = mongoose.model('Tracking'),
    UserInfo = mongoose.model('UserInfo');

exports.get_all_offers = (req, res) => {
    Product.find({}, (err, products) => {
        if (err)
            res.send(err);
        res.json(products);
    });
};

exports.get_tracking_offers = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.find(
        { 'user_id': uid },
        { tracking_list: 1 },
        (err, list) => {
            if (err)
                res.send(err);
            res.json(list);
        }
    );
};

// TODO: N.B. qui si presuppone che esista la entry, accertarsene
exports.add_tracking_product = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.update(
        { 'user_id': uid },
        { $push: { tracking_list: req.product } },
        (err, list) => {
            if (err)
                res.send(err);
            res.json(list);
        }
    );
    // Upsert in product se non esiste
    Product.update({'ASIN': req.product.ASIN}, req.product, { upsert: true });
};

exports.modify_profile = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    let newProfile = {
        user_id: uid,
        profilePhoto: req.body.profilePhoto,
        category_list: req.body.category_list
    };

    UserInfo.update({ 'user_id': uid },
        newProfile,
        { upsert: true },
        (err, res) => {
            if (err)
                res.send(err);
            res.json({ 'response': res });
        }
    );
};

exports.enable_notifications = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.update({ 'user_id': uid },
        { $set: { 'firebaseToken': req.body.firebaseToken } },
        { upsert: true }, (err, res) => {
            if (err)
                res.send(err);
            res.json({ "response": res });
        }
    );
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


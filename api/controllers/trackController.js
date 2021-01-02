'use strict';
var admin = require("firebase-admin");
var defaultAuth = admin.auth();

var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Tracking = mongoose.model('Tracking'),
    UserInfo = mongoose.model('UserInfo');

exports.get_all_offers = (req, res) => {
    Product.find({}, (err, products) => {
        if (err) {
            console.log(`ERROR GET/allOffers: ${err.code} - ${err.message}`);
            res.send(err);
        }
        console.log(`GET/allOffers: found ${products.length} products`);
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
            if (err) {
                console.log(`ERROR GET/trackingOffers: ${err.code} - ${err.message}`);
                res.send(err);
            }
            console.log(`GET/trackingOffers: found ${list.length} products`);
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

    // Upsert in product se non esiste
    Product.updateOne(
        { 'ASIN': req.body.ASIN },
        req.body,
        { upsert: true },
        (err, response) => {
            if (err) {
                console.log(`ERROR POST/addTrackingProduct: ${err.code} - ${err.message}`);
            }
            console.log(`POST/addTrackingProduct: product collection updated`);
        }
    );
    
    Tracking.updateOne(
        { 'user_id': uid },
        { $push: { tracking_list: req.body } },
        (err, response) => {
            if (err) {
                console.log(`ERROR: ${err.code} - ${err.message}`);
                res.send(err);
            }
            console.log(`POST/addTrackingProduct: updated ${response.nModified} product`);
            res.json(response);
        }
    );


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
        (err, response) => {
            if (err){
                console.log(`ERROR POST/modifyProfile: ${err.code} - ${err.message}`);
                res.send(err);
            }
            console.log(`POST/modifyProfile: ${response.nModified} profile updated`);
            res.json(response);
        }
    );
};

exports.enable_notifications = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.updateOne({ 'user_id': uid },
        { $set: { 'firebaseToken': req.body.firebaseToken } }, 
        (err, response) => {
            if (err){
                console.log(`ERROR POST/enableNotification: ${err.code} - ${err.message}`);
                res.send(err);
            }
            console.log(`POST/enableNotification: ${response.nModified} notification setting modified`);
            res.json(response);
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
        Tracking.insertOne(
            {'user_id':uid, 'firebaseToken':"", 'tracking_list':[]},
            (err, response) => {
                if (err){
                    console.log(`ERROR POST/addAccount: ${err.code} - ${err.message}`);
                    res.send(err);
                }
                console.log(`POST/addAccount: tracking collection user added`);
            }
        );
        UserInfo.insertOne(
            {'user_id':uid, 'profilePhoto':"", 'category_list':[]},
            (err, response) => {
                if (err){
                    console.log(`ERROR POST/addAccount: ${err.code} - ${err.message}`);
                    res.send(err);
                }
                console.log(`POST/addAccount: userInfo collection user added`);
            })

        res.status(201).send({ registration: "ok", uid: uid })
    } catch (err) {
        console.log(`ERROR POST/addAccount: ${err.code} - ${err.message}`);
        res.status(500).send({ registration: "error", message: `${err.code} - ${err.message}` });
    }


};


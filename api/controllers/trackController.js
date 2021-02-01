'use strict';
var admin = require("firebase-admin");
var defaultAuth = admin.auth();

var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Tracking = mongoose.model('Tracking'),
    UserInfo = mongoose.model('UserInfo');

exports.about_page = (req, res) => {
    res.render('index.html');
};

exports.get_all_offers = (req, res) => {
    Product.find({}, (err, products) => {
        if (err) {
            console.log(`ERROR GET/allOffers: ${err.code} - ${err.message}`);
            res.send({ ok: "-1", err: err.message, response: [] });
        }
        console.log(`GET/allOffers: found ${products.length} products`);
        res.json({ ok: "1", err: "no err", response: products });
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
                res.send({ ok: "-1", err: err.message, response: [] });
            }
            console.log(`GET/trackingOffers: found ${list[0].tracking_list.length} products`);
            res.json({ ok: "1", err: "no err", response: list[0].tracking_list });
        }
    );
};

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
                res.send({ ok: "-1", err: err.message, response: [] });
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
                res.send({ ok: "-1", err: err.message, response: [] });
            }
            else {
                console.log(`POST/addTrackingProduct: updated ${response.nModified} product`);
                res.json({ ok: "1", err: "no err", response: [req.body] });
            }
        }
    );
};

exports.remove_tracking_product = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.updateOne(
        { 'user_id': uid },
        { $pull: { tracking_list: req.body } },
        (err, response) => {
            if (err) {
                console.log(`ERROR: ${err.code} - ${err.message}`);
                res.send({ ok: "-1", err: err.message, response: [] });
            }
            else {
                console.log(`POST/removeTrackingProduct: updated ${response.nModified} product`);
                res.json({ ok: "1", err: "no err", response: [req.body] });
            }
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
            if (err) {
                console.log(`ERROR POST/modifyProfile: ${err.code} - ${err.message}`);
                res.send({ ok: "-1", err: err.message, response: [] });
            }
            console.log(`POST/modifyProfile: ${response.nModified} profile updated`);
            res.json({ ok: uid, err: "no err", response: newProfile });
        }
    );
};

exports.get_userProfile = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;


    UserInfo.findOne({ 'user_id': uid }, (err, user) => {
        if (err) {
            console.log(`ERROR POST/getUserProfile: ${err.code} - ${err.message}`);
            res.send({ ok: "-1", err: err.message, response: [] });
        }
        let newProfile = {
            user_id: uid,
            profilePhoto: user.profilePhoto,
            category_list: user.category_list
        };
        console.log(`POST/getUserProfile: found user ${uid}`);
        res.json({ ok: "1", err: "no err", response: newProfile });
    });
};


exports.register_firebaseToken = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split('Bearer ')[1];
    const decodedToken = await defaultAuth.verifyIdToken(token);
    let uid = decodedToken.uid;

    Tracking.updateOne({ 'user_id': uid },
        { $set: { 'firebaseToken': req.body.firebaseToken } },
        (err, result) => {
            if (err) {
                console.log(`ERROR POST/enableNotification: ${err.code} - ${err.message}`);
                res.send({ ok: "-1", err: err.message, response: [] });
            }
            console.log(`POST/enableNotification: ${result.nModified} notification setting modified`);
            res.json({ ok: "1", err: "no err", response: [] });
        }
    );
};

exports.add_account = async (req, res) => {
    try {
        const { displayName, password, email } = req.body

        if (!displayName || !password || !email) {
            return res.status(400).send({ message: 'Missing fields' })
        }
        const firebaseResult = await defaultAuth.createUser({
            email: email,
            password: password,
            displayName: displayName
        });

        let uid = firebaseResult.uid
        let newTrack = new Tracking({ 'user_id': uid, 'firebaseToken': "", 'tracking_list': [] })
        newTrack.save(
            (err, rs) => {
                if (err) {
                    console.log(`ERROR POST/addAccount: ${err.code} - ${err.message}`);
                    res.send({ ok: "-1", err: err.message, response: [] });
                }
                console.log(`POST/addAccount: tracking collection user added`);
            }
        );
        let newUser = new UserInfo({ 'user_id': uid, 'profilePhoto': "", 'category_list': [] });
        newUser.save(
            (err, rs) => {
                if (err) {
                    console.log(`ERROR POST/addAccount: ${err.code} - ${err.message}`);
                    res.send({ ok: "-1", err: err.message, response: [] });
                }
                console.log(`POST/addAccount: userInfo collection user added`);
            })

        res.status(201).send({ ok: "1", err: "no err", response: [] });
    } catch (err) {
        console.log(`ERROR POST/addAccount: ${err.code} - ${err.message}`);
        res.status(500).send({ ok: "-1", err: err.message, response: [] });
    }
};

exports.add_google_account = async (req, res) => {
    const { uid } = req.body

    try {
        let newTrack = new Tracking({ 'user_id': uid, 'firebaseToken': "", 'tracking_list': [] })
        newTrack.save(
            (err, rs) => {
                if (err) {
                    console.log(`ERROR POST/addAccountG: ${err.code} - ${err.message}`);
                    res.send({ ok: "-1", err: err.message, response: [] });
                }
                console.log(`POST/addAccountG: tracking collection user added`);
            }
        );
        let newUser = new UserInfo({ 'user_id': uid, 'profilePhoto': "", 'category_list': [] });
        newUser.save(
            (err, rs) => {
                if (err) {
                    console.log(`ERROR POST/addAccountG: ${err.code} - ${err.message}`);
                    res.send({ ok: "-1", err: err.message, response: [] });
                }
                console.log(`POST/addAccountG: userInfo collection user added`);
            })
    } catch (err) {
        console.log(`ERROR POST/addAccountG: ${err.code} - ${err.message}`);
        res.status(500).send({ ok: "-1", err: err.message, response: [] });
    }
    res.status(201).send({ ok: "1", err: "no err", response: [] });
};
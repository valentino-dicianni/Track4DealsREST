'use strict';

var mongoose = require('mongoose'),
    Product = mongoose.model('Product');


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

exports.verify_product = (req, res) => {
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

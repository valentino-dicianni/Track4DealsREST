'use strict';

var mongoose = require('mongoose'),
    Plant = mongoose.model('Plants');


exports.get_all_offers = (req, res) => {
    if (err)
        res.send(err);
    res.json({ "ok": "true" });

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

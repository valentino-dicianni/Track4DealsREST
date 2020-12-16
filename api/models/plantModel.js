'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PlantSchema = new Schema({
    name: String,
    sname: String,
    description: String,
    wiki: String,
    watering: Number,
    wamount: Number,
    temperature: Number,
    light: Number,
    humidity: Number,
    diseases: [{ name: String, description: String, prevention: String, treating: String }]
});
module.exports = mongoose.model('Plants', PlantSchema);
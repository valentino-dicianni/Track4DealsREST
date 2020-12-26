'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserInfoSchema = new Schema({
    user_id: Number, 
    profilePhoto : String,
    category_list : [String]
});
module.exports = mongoose.model('UserInfo', UserInfoSchema);
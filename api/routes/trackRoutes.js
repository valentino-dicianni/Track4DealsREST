'use strict';
module.exports = function (app) {
    var controller = require('../controllers/trackController');
    var auth = require('../auth/authenticated');

    app.route('/offers/get-offers')
        .get(controller.get_all_offers)

    app.route('/traking/get-offers')
        .get(auth.isAuthenticated, controller.get_tracking_offers);

    app.route('/tracking/verify/:productID')
        .post(auth.isAuthenticated, controller.verify_product);

    app.route('/tracking/add-tracking')
        .post(auth.isAuthenticated, controller.add_tracking_product);

    app.route('/tracking/enable_notifications')
        .get(controller.add_account);

    app.route('/profile/modify_profile')
        .post(auth.isAuthenticated, controller.modify_profile);

    app.route('/auth/create_account')
        .post(controller.add_account);

}
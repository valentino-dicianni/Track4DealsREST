'use strict';
module.exports = function (app) {
    var controller = require('../controllers/trackController')

    app.route('/offers/get-offers')
        .get(controller.get_all_offers)

    app.route('/traking/get-offers')
        .get(controller.get_tracking_offers);

    app.route('/tracking/verify/:productID')
        .post(controller.verify_product);

    app.route('/tracking/add-tracking')
        .post(controller.add_tracking_product);

    app.route('/profile/modify_profile')
        .post(controller.modify_profile);
}
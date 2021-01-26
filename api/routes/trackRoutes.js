"use strict";
module.exports = function (app) {
  var controller = require("../controllers/trackController");
  var amazon = require("../controllers/amazonController");

  var auth = require("../auth/authenticated");

  app.route("/").get(controller.about_page);

  app.route("/offers/get_offers").get(controller.get_all_offers);

  app
    .route("/tracking/get_offers")
    .get(auth.isAuthenticated, controller.get_tracking_offers);

  app
    .route("/tracking/verify")
    .post(auth.isAuthenticated, amazon.verify_product);

  app
    .route("/tracking/add_tracking")
    .post(auth.isAuthenticated, controller.add_tracking_product);

  app
    .route("/tracking/remove_tracking")
    .post(auth.isAuthenticated, controller.remove_tracking_product);

  app
    .route("/profile/modify_profile")
    .post(auth.isAuthenticated, controller.modify_profile);

  app
    .route("/profile/get_user")
    .post(auth.isAuthenticated, controller.get_userProfile);


  app.route("/auth/create_account").post(controller.add_account);

  app.route("/auth/create_google_account").post(controller.add_google_account);

  app
    .route("/auth/register_firebaseToken")
    .post(auth.isAuthenticated, controller.register_firebaseToken);

};

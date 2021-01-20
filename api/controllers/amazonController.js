'use strict';
const Api = require('amazon-pa-api50')
const Config = require('amazon-pa-api50/lib/config');
require('dotenv').config();

const resources = require('amazon-pa-api50/lib/options').Resources
const Localresources = {
  getOffers: [
    "Offers.Listings.Price"
  ]
}
const condition = require('amazon-pa-api50/lib/options').Condition
const searchIndex = require('amazon-pa-api50/lib/options').SearchIndex
const country = require('amazon-pa-api50/lib/options').Country

// Config Amazon API
let myConfig = new Config(country.Italy);
myConfig.accessKey = process.env.ACCESS_KEY;
myConfig.secretKey = process.env.SECRET_KEY;
myConfig.partnerTag = process.env.PARTNER_TAG;
myConfig.host = 'webservices.amazon.it'; //Amazon Italia
myConfig.region = 'eu-west-1'; // Italy
const api = new Api(myConfig)

exports.verify_product = async (req, res) => {
  let amazonRes = await getProductFromAmazon(req.params.productASIN).catch(e => {
    res.send({ ok: "-1", err: err.message, response: [] });
    console.log(e);
  });
  if (amazonRes != undefined) {
    productInfo = amazonRes.data.ItemsResult.Items[0];
    res.json({ ok: "1", err: "no err", response: [productInfo] });
  }

};


/**
 * @param {*} product 
 * Get Info about the product from Amazon server
 */
const getProductFromAmazon = async function (ASIN) {
  console.log(`Checking product ${ASIN} on Amazon...`)

  let resourceList = resources.getItemInfo
  resourceList = resourceList
    .concat(resources.getItemInfo)
    .concat(Localresources.getOffers)
  try {
    return await api.getItemById([ASIN], {
      parameters: resourceList,
      condition: condition.New
    });
  } catch (err) {
    console.log("ERROR with AMAZON: ", err)
  }

}
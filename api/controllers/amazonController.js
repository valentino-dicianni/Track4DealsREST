'use strict';
const Api = require('amazon-pa-api50')
const Config = require('amazon-pa-api50/lib/config');
require('dotenv').config();

const resources = require('amazon-pa-api50/lib/options').Resources
const Localresources = {
  getOffers: [
    "Offers.Listings.Price",
    "Images.Primary.Medium",
    "Images.Primary.Large"
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
  let amazonRes = await getProductFromAmazon(req.body.productASIN).catch(e => {
    res.send({ ok: "-1", err: err.message, response: [] });
    console.log(e);
  });

  if (amazonRes != undefined) {
    try {
      let productInfo = amazonRes.data.ItemsResult.Items[0];
      //console.log(productInfo)
      let nor_price;
      let off_price;
      let disc_perc;
      let deal;
      console.log(productInfo.Offers.Listings[0]);
      if (productInfo.Offers != undefined) {
        if (productInfo.Offers.Listings[0].Price.Savings != undefined) {
          nor_price = (productInfo.Offers.Listings[0].Price.Amount + productInfo.Offers.Listings[0].Price.Savings.Amount).toFixed(2);
          off_price = (productInfo.Offers.Listings[0].Price.Amount).toFixed(2);
          disc_perc = productInfo.Offers.Listings[0].Price.Savings.Percentage;
          deal = true;
        }
        else {
          nor_price = (productInfo.Offers.Listings[0].Price.Amount).toFixed(2);
          off_price = (productInfo.Offers.Listings[0].Price.Amount).toFixed(2);
          disc_perc = 0;
          deal = false;
        }
        let proudctRes = {
          ASIN: productInfo.ASIN,
          product_url: productInfo.DetailPageURL,
          title: productInfo.ItemInfo.Title.DisplayValue,
          brand: productInfo.ItemInfo.ByLineInfo.Brand.DisplayValue,
          category: productInfo.ItemInfo.Classifications.Binding.DisplayValue,
          description: productInfo.ItemInfo.Features.DisplayValues[0],
          normal_price: nor_price,
          offer_price: off_price,
          discount_perc: disc_perc,
          imageUrl_large: productInfo.Images.Primary.Large.URL,
          imageUrl_medium: productInfo.Images.Primary.Medium.URL,
          isDeal: deal
        }
        res.json({ ok: "1", err: "no err", response: [proudctRes] });
      } else {
        console.log(`POST/verifyProduct: no available price`);
        res.send({ ok: "-1", err: "No data available for that product", response: [] });
      }
    } catch (error) {
      console.log(`POST/verifyProduct: error with Amazon DB: ${error}`);
      res.send({ ok: "-1", err: "Error from Amazon database", response: [] });
    }
  }
  else {
    res.send({ ok: "-1", err: "No data available for that product", response: [] });
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
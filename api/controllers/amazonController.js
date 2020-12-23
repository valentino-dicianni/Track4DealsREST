'use strict';
const Api = require('amazon-pa-api50')
const Config = require('amazon-pa-api50/lib/config');

const resources = require('amazon-pa-api50/lib/options').Resources
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


exports.verify_product = (req, res) => {
    if (err)
        res.send(err);
    res.json({ "ok": "true" });

};

const testSearch = () => {
    console.log(' ===== search result =====')
  
    let resourceList = resources.getItemInfo
    resourceList = resourceList.concat(resources.getImagesPrimary)
  
    api.search("tv lg", {
      parameters: resourceList,
      searchIndex: searchIndex.Electronics
    }).then((response) => {
      console.log("RES: %j", response.data)
    }, (error) => {
      console.log('Error: ', error)
    })
  }
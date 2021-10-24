module.exports.handler = async (event, context, callback) => {
  const _ = require("lodash");
  const ServiceManager = require("/opt/ServicesManager");
  const { buildResponse } = require("/opt/response.lib.js");

  try {
    const serviceList = await ServiceManager.getServicesList();

    const ordered = _.orderBy(serviceList, "orderKey").map(item => {
      if (_.isArray(item.subservices)) {
        return {
          ...item,
          subservices: _.orderBy(item.subservices, "orderKey")
        };
      }

      return item;
    });

    callback(null, buildResponse(200, ordered));
  } catch (error) {
    console.error("get services error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};

const { NODE_ENV } = process.env;
const { buildResponse } = require(NODE_ENV === 'test' ? "../../../LibsLayer/ResponseLibLayer/response.lib" : "/opt/response.lib.js");
const ServiceManager = require(NODE_ENV === 'test' ? "../../../ManagersLayer/Managers/ServicesManager" : "/opt/ServicesManager");

module.exports.handler = async (event, context, callback) => {
  try {
    const serviceList = await ServiceManager.getPopularServices();

    callback(null, buildResponse(200, serviceList));
  } catch (error) {
    console.error("get pop services error, ", error);

    callback(null, buildResponse(500, "Internal server error"));
  }
};

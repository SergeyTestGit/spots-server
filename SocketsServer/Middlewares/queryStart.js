const _ = require("lodash");

module.exports = function(req, res, next) {
  console.group('NEW REQUEST')
  console.log('originalUrl', req.originalUrl)
  console.log('headers', req.headers)
  console.log('params', req.params)
  console.log('body', req.body)
  console.groupEnd()

  next();
};

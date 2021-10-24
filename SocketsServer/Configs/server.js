const { HTTP_PORT } = process.env;

module.exports = {
  http: {
    port: HTTP_PORT || 8080
  }
};

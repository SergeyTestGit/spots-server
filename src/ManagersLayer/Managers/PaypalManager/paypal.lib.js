const paypal = require("paypal-rest-sdk");

const SecretsManager = require("/opt/SecretsManager");

const configurePaypal = async () => {
  console.log("configurePaypal");
  const paypalCredsStr = await SecretsManager.getSecretValue("spotjobs/paypal");
  console.log({ paypalCredsStr });
  const paypalCreds = JSON.parse(paypalCredsStr);

  const config = {
    mode: process.env.StageName === "prod" ? "live" : "sandbox",
    client_id: paypalCreds.PAYPAL_CLIENT_ID,
    client_secret: paypalCreds.PAYPAL_CLIENT_SECRET
  };
  console.log(config);

  paypal.configure(config);

  console.log("configure done");
  return paypal;
};

module.exports.configurePaypal = configurePaypal;
module.exports.paypalCli = paypal;

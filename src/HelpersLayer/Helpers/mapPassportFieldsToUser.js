const _ = require("lodash");

module.exports = profile => {
  console.log("\n\nPROFILE\n", profile, "\n\n\n");

  const addresses = _.get(profile, "addresses", []);
  const primatyAddress = addresses[0];

  const emails = _.get(profile, "emails", []);
  const primaryEmail = _.find(
    emails || [],
    email => email.primary === "true" || email.type === "account"
  );

  const email = primaryEmail || emails[0];

  const fullName = _.get(profile, "displayName", "");
  const fullNameParts = fullName.split(" ");

  const firstName = _.get(
    profile,
    "name.givenName",
    fullNameParts[0] +
      (fullNameParts.length > 2 ? ` ${fullNameParts[1]}` : "") || ""
  );
  const lastName = _.get(
    profile,
    "name.familyName",
    _.last(fullNameParts) || ""
  );

  const newUser = {
    authProvider: profile.provider,
    avatarB64: _.get(profile, "photos[0].value", undefined),
    firstName,
    lastName,
    birthdate: _.get(profile, "birthday"),
    address: _.get(primatyAddress, "streetAddress", ""),
    city: _.get(primatyAddress, "locality", ""),
    state: _.get(primatyAddress, "region", ""),
    zip: _.get(primatyAddress, "postalCode", ""),
    country: _.get(primatyAddress, "country", ""),
    email: email && email.value,
    emailVerified: "true"
  };

  if (_.isString(newUser.avatarB64)) {
    if (profile.provider === "google") {
      newUser.avatarB64 = _.replace(newUser.avatarB64, "s50", "s500"); // to increase google avatar quality
    } else if (profile.provider === "facebook") {
      // to increase facebook avatar quality
      newUser.avatarB64 = `https://graph.facebook.com/${
        profile.id
      }/picture?width=9999`;
    }
  }

  console.log("\nNEW USER\n", newUser, "\n\n\n");

  return newUser;
};

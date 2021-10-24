const { toUpper } = require("lodash");

const getUsersLink = require("./getUsersLink");

module.exports = usersProfile => {
  const usersFirstName = usersProfile.given_name || "";
  const usersLastName = usersProfile.family_name
    ? toUpper(` ${usersProfile.family_name.slice(0, 1)}.`)
    : null;

  const usersFullName = usersFirstName + usersLastName;

  const usersProfileLink = getUsersLink(usersProfile);

  return `<a href="${usersProfileLink}">${usersFullName}</a>`;
};

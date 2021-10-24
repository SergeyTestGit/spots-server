const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i;
const phoneNumberRegex = /^[+][0-9]{1,2}[0-9]{10}$/;

const isEmail = str => emailRegex.test(str);

const isPhoneNumber = str => phoneNumberRegex.test(str);

module.exports.emailRegex = emailRegex;
module.exports.phoneNumberRegex = phoneNumberRegex;
module.exports.isEmail = isEmail;
module.exports.isPhoneNumber = isPhoneNumber;

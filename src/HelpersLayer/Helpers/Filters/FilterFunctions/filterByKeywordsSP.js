const _ = require("lodash");

const filterByKeywords = (serviceProvider, filterData, user) => {
  const keywordsArray = _.split(filterData.keywords, " ");

  for (
    let keywordIndex = 0;
    keywordIndex < keywordsArray.length;
    keywordIndex++
  ) {
    const keyword = keywordsArray[keywordIndex];

    const regex = new RegExp(`(${keyword})`, "gi");

    if ((serviceProvider.about || "").match(regex)) {
      return serviceProvider;
    }
  }

  return null;
};

module.exports = filterByKeywords;

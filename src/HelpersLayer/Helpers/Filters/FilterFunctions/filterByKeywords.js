const _ = require("lodash");

const filterByKeywords = (job, filterData, user) => {
  const keywordsArray = _.split(filterData.keywords, " ");

  for (
    let keywordIndex = 0;
    keywordIndex < keywordsArray.length;
    keywordIndex++
  ) {
    const keyword = keywordsArray[keywordIndex];

    const regex = new RegExp(`(${keyword})`, "gi");

    if (
      (job.title || "").match(regex) ||
      (job.description || "").match(regex)
    ) {
      return job;
    }
  }

  return null;
};

module.exports = filterByKeywords;

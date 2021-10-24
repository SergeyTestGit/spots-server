const _ = require("lodash");

const getPageList = (list, pageNumber, elementsPerPage) => {
  const pageStartIndex = pageNumber * elementsPerPage;
  let pageEndIndex = pageStartIndex + elementsPerPage;
  let isListEnd = false;

  if (pageEndIndex >= list.length) {
    pageEndIndex = list.length;
    isListEnd = true;
  }

  const pageList = _.slice(list, pageStartIndex, pageEndIndex);

  return {
    listStartIndex: pageStartIndex,
    listEndIndex: pageEndIndex,
    list: pageList,
    isListEnd
  };
};

module.exports = getPageList;

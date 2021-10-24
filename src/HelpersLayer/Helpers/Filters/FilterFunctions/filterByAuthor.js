const filterByCategory = (job, filterData, user) => {
  const { author } = filterData;

  if (job.author === author) {
    return job;
  }

  return null;
};

module.exports = filterByCategory;

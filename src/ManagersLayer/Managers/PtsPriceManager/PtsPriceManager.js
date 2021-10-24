const PtsPrice = require("./PtsPrice.model");

class PtsPriceManager {
  getAllPtsPrices() {
    return new Promise((resolve, reject) => {
      PtsPrice.scan().exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  addRegionPtsPrice(regionName, price) {
    return new Promise((resolve, reject) => {
      const newRegionPrice = {
        region: regionName,
        price
      };

      const newPtsPrice = new PtsPrice(newRegionPrice);

      newPtsPrice.save(err => {
        if (err) return reject(err);

        resolve(newPtsPrice);
      });
    });
  }
}

module.exports = PtsPriceManager;

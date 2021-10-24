const TrackSpManger = require("../../../Managers/TrackManager");

module.exports = (data, connection) => {
  TrackSpManger.subscribeSpTrack(connection.user.username, data.spId);
};

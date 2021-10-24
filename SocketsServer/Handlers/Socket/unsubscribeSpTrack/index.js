const TrackSpManger = require("../../../Managers/TrackManager");

module.exports = (data, connection) => {
  TrackSpManger.unsubscribeSpTrack(connection.user.username, data.spId);
};

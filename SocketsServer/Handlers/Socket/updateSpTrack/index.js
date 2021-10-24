const TrackSpManger = require("../../../Managers/TrackManager");

module.exports = (data, connection) => {
  TrackSpManger.setSPTrack(connection.user.username, data.geolocation);
};

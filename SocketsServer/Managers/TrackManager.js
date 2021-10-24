const SocketsManager = require("./Sockets.manager");
const SocketEventType = require('../Constants/socketEventTypes')

const TRACK_SPS = {};
const TRACK_SPS_SUBSCRIPTIONS = {};

class TrackManager {
  setSPTrack(spId, geolocation) {
    console.log("setSPTrack", spId, geolocation);
    TRACK_SPS[spId] = geolocation;

    console.log("TRACK_SPS_SUBSCRIPTIONS[spId]", TRACK_SPS_SUBSCRIPTIONS[spId]);
    (TRACK_SPS_SUBSCRIPTIONS[spId] || []).map(userId => {
      SocketsManager.sendMessage(
        { username: userId },
        SocketEventType.spTrackUpdated,
        {
          geolocation
        }
      ).catch();
    });
  }

  subscribeSpTrack(userId, spId) {
    console.log("subscribeSpTrack", userId, spId);
    if (!TRACK_SPS_SUBSCRIPTIONS[spId]) {
      TRACK_SPS_SUBSCRIPTIONS[spId] = [];
    }

    TRACK_SPS_SUBSCRIPTIONS[spId].push(userId);

    console.log("TRACK_SPS_SUBSCRIPTIONS", TRACK_SPS_SUBSCRIPTIONS);

    SocketsManager.sendMessage(
      { username: userId },
      SocketEventType.spTrackUpdated,
      {
        geolocation: TRACK_SPS[spId] || null
      }
    ).catch();
  }

  unsubscribeSpTrack(userId, spId) {
    console.log('unsubscribeSpTrack', userId, spId)
    TRACK_SPS_SUBSCRIPTIONS[spId] = (
      TRACK_SPS_SUBSCRIPTIONS[spId] || []
    ).filter(user => user !== userId);


    console.log("TRACK_SPS_SUBSCRIPTIONS", TRACK_SPS_SUBSCRIPTIONS);
  }
}

module.exports = new TrackManager();

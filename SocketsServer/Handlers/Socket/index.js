const SocketEventType = require("../../Constants/socketEventTypes");

const onSendMessage = require("./onSendMessage");
const onAuthenticate = require("./onAuthenticate");
const onSubscribeSpTrack = require("./subscribeSpTrack");
const onUpdateSpTrack = require("./updateSpTrack");
const onUnsubscribeSpTrack = require("./unsubscribeSpTrack");
const onDisconnect = require("./onDisconnect");
const onJobUnavailable = require("./jobUnavailable");
const onJobMatchesProfile = require("./jobMatchesProfile");

module.exports = {
  [SocketEventType.sendMessage]: onSendMessage,
  [SocketEventType.authenticate]: onAuthenticate,
  [SocketEventType.subscribeSpTrack]: onSubscribeSpTrack,
  [SocketEventType.updateSpTrack]: onUpdateSpTrack,
  [SocketEventType.unsubscribeSpTrack]: onUnsubscribeSpTrack,
  [SocketEventType.disconnect]: onDisconnect,
  [SocketEventType.jobUnavailable]: onJobUnavailable,
  [SocketEventType.jobMatchesProfile]: onJobMatchesProfile,
};

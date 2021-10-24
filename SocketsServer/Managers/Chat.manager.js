const _ = require("lodash");
const uuid = require("uuid");

const Chat = require("../Models/Chat.model");

const JobApplicationManager = require("./ApplyForJobManager");
const JobManager = require("./Job.manager");
const SocketManager = require("./Sockets.manager");
const NotificationManager = require("./NotificationManager");
const UserCognitoManager = require("./UserCognitoManager");

const jobApplicationStatus = require("../Constants/jobApplicationStatus");
const SocketEventType = require("../Constants/socketEventTypes");
const NotificationType = require("../Constants/NotificationType");

class ChatManager {
  async findOrCreateChat(jobId, jobTitle, partnerId, requestUserId, blockedBy) {
    const existingChats = await Chat.scan()
      .filter("users")
      .contains(requestUserId)
      .all()
      .exec();

    let existingChat = _.find(
      existingChats,
      chat => chat.users.indexOf(partnerId) > -1
    );

    if (!existingChat) {
      const chatData = {
        jobId,
        jobTitle,
        status: "active",
        users: [requestUserId, partnerId],
        messages: [],
        blockedBy
      };

      existingChat = new Chat(chatData);

      await existingChat.save();
    }

    existingChat.partner = _.pick(
      await UserCognitoManager.getCognitoUser({
        username: partnerId
      }),
      ["given_name", "family_name", "username", "avatarURL", "isPremium"]
    );
    if(existingChat.status === 'inactive') {
      const { updatedAt: completedAt } = await JobManager.getJobById(existingChat.jobId);
      existingChat.completedAt = completedAt;
    }
    return existingChat;
  }

  async addMessageToChat(chatId, message, senderId) {
    const existingChat = await Chat.get({ _id: chatId });

    if (!existingChat) return;

    if (existingChat.status === "inactive") return;

    message._id = uuid.v4();
    message.createdAt = Date.now();
    message.sender = senderId;

    existingChat.messages.push(message);

    await existingChat.save();

    const partnerId = _.find(existingChat.users, usr => usr !== senderId);

    SocketManager.sendMessage(
      { username: partnerId },
      SocketEventType.messageReceived,
      {
        chatId,
        message
      }
    );

    if(existingChat.messages.length) {
      NotificationManager.createNotification({
        userId: partnerId,
        notificationType: NotificationType.newMessage,
        data: {
          userId: senderId,
          chatId
        }
      }).catch(err => console.log(err));
    } else {
      NotificationManager.createNotification({
        userId: partnerId,
        notificationType: NotificationType.firstMessage,
        data: {
          userId: senderId,
          chatId
        }
      }).catch(err => console.log(err));
    }

    return message;
  }

  async getUsersActiveChats(userId) {
    const chats = await this.getUsersChats(userId);
    const users = await this.getUsersPossibleChatPartners(userId);

    const activeChats = chats.filter(chat => {
      const partnerId = _.find(chat.users, user => user !== userId);

      return users.indexOf(partnerId) > -1;
    });

    return activeChats;
  }

  async getUsersPossibleChatPartners(userId) {
    const usersJobs = await JobManager.getUsersJobs(userId);
    const postedJobs = usersJobs.posted;
    const hiredForJobs = usersJobs.booked;

    let jobApplications = [];
    let appliedJobsList = [];

    const postedJobsIds = postedJobs.map(job => job._id);
    const usersApplications = (await JobApplicationManager.getUsersApplications(
      userId
    )).filter(app => app.status === jobApplicationStatus.accepted);

    if (postedJobsIds.length > 0) {
      jobApplications = await JobApplicationManager.getApplicationsForJobs(
        postedJobsIds
      );
    }

    if (usersApplications.length > 0) {
      appliedJobsList = await JobManager.getJobListByIds(
        usersApplications.map(app => app.jobId)
      );
    }

    const users = _.concat(
      appliedJobsList.map(job => job.author),
      hiredForJobs.map(job => job.author)
    );

    jobApplications.forEach(app => {
      if (app.status === jobApplicationStatus.accepted || app.status === jobApplicationStatus.applied) {
        users.push(app.userId);
      }
    });

    return _.uniq(users);
  }

  getUsersChats(userId) {
    return new Promise((resolve, reject) => {
      Chat.scan("users")
        .contains(userId)
        .exec((err, data) => {
          if (err) return reject(err);

          resolve(data);
        });
    });
  }

  async blockChat(chatId, userId) {
    const message = {};
    const chatToBlock = await Chat.get({ _id: chatId });
    if (!chatToBlock) return;
    if (chatToBlock.status === "inactive") return;

    if (chatToBlock.status !== 'blocked') {
      chatToBlock.blockedBy = userId;
      chatToBlock.status = 'blocked';
      await chatToBlock.save();
    } else if (chatToBlock.status === 'blocked' && chatToBlock.blockedBy === userId) {
      chatToBlock.blockedBy = '';
      chatToBlock.status = 'active';
      await chatToBlock.save();
    }

    message.text = chatToBlock.status === 'blocked'
      ? '+NjSRRW1lPggeqleTXDt/HtjO4MqkwL3pNcPzkPcL7No1ih5Jm6G6dp1uzZd233JZRnjpUt4fgBwH'
      : 'pgciFniskM6vHj7TPg5eMoDe2MRe58jBBkMHKlLou9qMPZxENADgegHNpHBKAPMZbaFKL0Wbp6';
    message._id = uuid.v4();
    message.createdAt = Date.now();
    message.sender = userId;
    message.type = 'regular_message';

    const partnerId = _.find(chatToBlock.users, usr => usr !== userId);

    SocketManager.sendMessage(
      { username: partnerId },
      SocketEventType.messageReceived,
      {
        chatId,
        message
      }
    );
    // SocketManager.sendMessage(
    //   { username: userId },
    //   SocketEventType.messageReceived,
    //   {
    //     chatId,
    //     message
    //   }
    // );
    return message;
  }
}

module.exports = new ChatManager();
module.exports.ChatManager = ChatManager;

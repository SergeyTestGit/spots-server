const _ = require("lodash");

const Chat = require("./Chat");

// const chatStatus = require("../.../../../../../shared/nodejs/Constants/ChatStatus");

class ChatManager {
  /**
   * Creates new chat record in DynamoDB
   * @param {Object} chatData New chat data
   *
   * @returns new chat
   */
  createChat(chatData) {
    return new Promise(async (resolve, reject) => {
      const newChat = new Chat(chatData);

      newChat.save(err => {
        if (err) return reject(err);

        resolve(newChat);
      });
    });
  }

  /**
   * Find all user's active chats
   *
   * @param {String} userId User's ID
   *
   * @returns Actve chats list
   */
  findUsersActiveChats(userId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `chatStatus = :chatStatus and (contains(users, :userId))`,
        ExpressionAttributeValues: {
          ":chatStatus": chatStatus.active,
          ":userId": userId
        }
      };

      Chat.scan(filter).exec((err, data) => {
        if (err) return reject(err);

        resolve(data);
      });
    });
  }

  /**
   * Find Chat for two users by their ID's
   * 
   * @param {String} firstUserId  First User ID
   * @param {String} secondUserId Second User ID
   * 
   * 
   */
  findChatForTwoUsers(firstUserId, secondUserId) {
    return new Promise((resolve, reject) => {
      const filter = {
        FilterExpression: `(contains(users, :firstUserId)) and (contains(users, :secondUserId))`,
        ExpressionAttributeValues: {
          ":firstUserId": firstUserId,
          ":secondUserId": secondUserId
        }
      };

      Chat.scan(filter).exec((err, data) => {
        if (err || !_.isArray(data) || !data[0]) return reject(err);

        resolve(data[0]);
      });
    });
  }

  /**
   * Change chat status when job is completed
   * 
   * @param {String} jobId  Job ID
   * 
   * 
   */

  async changeChatStatusToInactive(jobId) {
    const chatsToUpdate = await Chat.scan()
      .filter("jobId")
      .contains(jobId)
      .all()
      .exec();
    console.log('chatsToUpdate: ', chatsToUpdate);

    const updatedChats = await Promise.all(chatsToUpdate.map(async ({ _id }) => {
      return new Promise((resolve, reject) => {
        Chat.update({ _id }, { status: 'inactive' }, (err, data) => {
          if (err) return reject(err);
  
          resolve(data);
        });
      });
    }));

    console.log('updatedChats: ', updatedChats);
  }
}

module.exports = ChatManager;

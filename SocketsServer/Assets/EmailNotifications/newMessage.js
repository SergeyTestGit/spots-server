const generateUsersLink = require("./utils/generateUserLink");
const generateChatLink = require("./utils/generateChatLink");
const getUsersAvatarLink = require("./utils/getUsersAvatarLink");

module.exports = {
  en: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Hello, You have a new message from ${generateUsersLink(
        user
      )}.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  fr: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Vous avez un nouveau message de la part de ${generateUsersLink(
        user
      )}.<br/>Cliquez ci-dessous pour plus de détails.`,
      buttonText: "Voir les Détails",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  es: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Tienes un nuevo mensaje de ${generateUsersLink(
        user
      )}.<br/>Click abajo para más detalles.`,
      buttonText: "Ver detalles",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  it: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Hai un nuovo messaggio da parte di ${generateUsersLink(
        user
      )}.<br/>Clicca qui sotto per ulteriori informazioni.`,
      buttonText: "Visualizza dettagli",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  pt: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Você tem uma nova mensagem de ${generateUsersLink(
        user
      )}.<br/>Clique abaixo para mais detalhes.`,
      buttonText: "Ver detalhes",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  de: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Du hast eine neue Nachricht von ${generateUsersLink(
        user
      )}.<br/>Klicke unten für mehr Details.`,
      buttonText: "Zeige Details",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  hi: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `आपको इनसे एक नया संदेश मिला है ${generateUsersLink(
        user
      )}.<br/>अधिक जानकारी के लिए नीचे क्लिक करें.`,
      buttonText: "अधिक जानकारी देखें",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  bn: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `আপনার জন্যে নতুন বার্তা এসেছে এর থেকে ${generateUsersLink(
        user
      )}.<br/>বিস্তারিত জানতে নিচে ক্লিক করুন.`,
      buttonText: "বিস্তারিত দেখুন",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  te: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `మీకు వీరి నుండి కొత్త సందేశం వచ్చింది ${generateUsersLink(
        user
      )}.<br/>ఎక్కువ వివరాల కోసం కింద క్లిక్ చేయండి.`,
      buttonText: "వివరాలను చూపించు",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  gu: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `તમારી ઉપર એક નવો મેસેજ ${generateUsersLink(
        user
      )}.<br/>વધુ વિગતો માટે નીચે ક્લિક કરો.`,
      buttonText: "વિગતો જુઓ",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  kn: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `ಇವರಿಂದ ನಿಮಗೆ ಹೊಸ ಸಂದೇಶವಿದೆ ${generateUsersLink(
        user
      )}.<br/>ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.`,
      buttonText: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  ml: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `നിന്നും താങ്കൾക്ക് പുതിയ സന്ദേശം ഉണ്ട് ${generateUsersLink(
        user
      )}.<br/>കൂടുതൽ വിവരങ്ങൾക്ക് താഴെ ക്ലിക്ക് ചെയ്യുക.`,
      buttonText: "വിശദാംശങ്ങൾ കാണുക",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  mr: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `आपल्याला एक नविन संदेश आला आहे ${generateUsersLink(
        user
      )}.<br/>अधिक तपशीलासाठी खाली क्लिक करा.`,
      buttonText: "तपशील पहा",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  ta: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: ` நீங்கள் இவரிடமிருந்து புதிய செய்திகளைப் பெற்றீர்கள் ${generateUsersLink(
        user
      )}.<br/>மேலதிக விவரங்களுக்குக் கீழே சொடுக்கவும்.`,
      buttonText: "விவரங்களைப் பார்க்க‌",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  },
  ru: notificationData => {
    const { user, userId } = notificationData.data;
    return {
      title: "New Message",
      message: `Вы получили новое сообщение от ${generateUsersLink(
        user
      )}.<br/>Нажмите ниже для более подробной информации.`,
      buttonText: "Посмотреть детали",
      buttonPath: generateChatLink(userId),
      imageUrl: getUsersAvatarLink(user)
    };
  }
};

const generateUsersLink = require("./utils/generateUserLink");
const generateJobsLink = require("./utils/generateJobLink");
const getJobsImageLink = require("./utils/getJobsImageLink");

const getJobsLink = require("./utils/getJobsLink");

module.exports = {
  en: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Hello, ${generateUsersLink(
        user
      )} would like to hire you for the job entitled ${generateJobsLink(
        job
      )}.<br/>Click below for more details.`,
      buttonText: "View Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  fr: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Bonjour, ${generateUsersLink(
        user
      )} souhaiterait vous embaucher pour l'emploi en référence ${generateJobsLink(
        job
      )}.<br/>Cliquez ci-dessous pour plus de détails.`,
      buttonText: "Voir les Détails",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  es: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Hola, ${generateUsersLink(
        user
      )} Le gustaría contratarte para el trabajo ${generateJobsLink(
        job
      )}.<br/>Click abajo para más detalles.`,
      buttonText: "Ver detalles",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  it: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Ciao, ${generateUsersLink(
        user
      )} vorrebbe assumerti per il lavoro dal titolo ${generateJobsLink(
        job
      )}.<br/>Clicca qui sotto per ulteriori informazioni.`,
      buttonText: "Visualizza dettagli",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  pt: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Olá, ${generateUsersLink(
        user
      )} gostaria de contratá-lo para o trabalho sem título ${generateJobsLink(
        job
      )}.<br/>Clique abaixo para mais detalhes.`,
      buttonText: "Ver detalhes",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  de: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Hallo, ${generateUsersLink(
        user
      )} möchte dich für einen Job ohne Titel einstellen ${generateJobsLink(
        job
      )}.<br/>Klicke unten für mehr Details.`,
      buttonText: "Zeige Details",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  hi: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `नमस्ते, ${generateUsersLink(
        user
      )} आपको इस काम के लिए नियुक्त करना चाहते है ${generateJobsLink(
        job
      )}.<br/>अधिक जानकारी के लिए नीचे क्लिक करें.`,
      buttonText: "अधिक जानकारी देखें",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  bn: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `হ্যালো, ${generateUsersLink(
        user
      )} শিরোনামহীন কাজটির জন্য আপনাকে নিয়োগ করতে চান ${generateJobsLink(
        job
      )}.<br/>বিস্তারিত জানতে নিচে ক্লিক করুন.`,
      buttonText: "বিস্তারিত দেখুন",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  te: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `హలో, ${generateUsersLink(
        user
      )} అన్ టైటిల్ జాబు కోసం మిమ్మల్ని తీసుకోవాలి అనుకుంటున్నారు ${generateJobsLink(
        job
      )}.<br/>ఎక్కువ వివరాల కోసం కింద క్లిక్ చేయండి.`,
      buttonText: "వివరాలను చూపించు",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  gu: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `હેલો, ${generateUsersLink(
        user
      )} અનામાંકિત જોબ માટે તમને ભાડે રાખવા માંગે છે ${generateJobsLink(
        job
      )}.<br/>વધુ વિગતો માટે નીચે ક્લિક કરો.`,
      buttonText: "વિગતો જુઓ",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  kn: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `ನಮಸ್ಕಾರ, ${generateUsersLink(
        user
      )} ಹೆಸರಿಸದ ಕೆಲಸಕ್ಕಾಗಿ ನಿಮ್ಮನ್ನು ನೇಮಿಸಿಕೊಳ್ಳಲು ಬಯಸುತ್ತೇನೆ ${generateJobsLink(
        job
      )}.<br/>ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೆಳಗೆ ಕ್ಲಿಕ್ ಮಾಡಿ.`,
      buttonText: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  ml: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `ഹലോ, ${generateUsersLink(
        user
      )} അൺടൈറ്റിൽഡ് ജോബിന് താങ്കളെ എടുക്കാൻ ആഗ്രഹിക്കുന്നു ${generateJobsLink(
        job
      )}.<br/>കൂടുതൽ വിവരങ്ങൾക്ക് താഴെ ക്ലിക്ക് ചെയ്യുക.`,
      buttonText: "വിശദാംശങ്ങൾ കാണുക",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  mr: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `नमस्कार, ${generateUsersLink(
        user
      )} तुम्हाला या कामासाठी नियुक्त करू इच्छितात ${generateJobsLink(
        job
      )}.<br/>अधिक तपशीलासाठी खाली क्लिक करा.`,
      buttonText: "तपशील पहा",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  ta: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `வணக்கம், ${generateUsersLink(
        user
      )} உங்களை, (தலைப்பிடப்படாத) வேலைக்குத் தேர்வு செய்ய விருப்பப்படுகிறார் ${generateJobsLink(
        job
      )}.<br/>மேலதிக விவரங்களுக்குக் கீழே சொடுக்கவும்.`,
      buttonText: "விவரங்களைப் பார்க்க",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
  ru: notificationData => {
    const { job, user } = notificationData.data;
    return {
      title: "New Job Request",
      message: `Привет, ${generateUsersLink(
        user
      )} хотел бы нанять вас на работу ${generateJobsLink(
        job
      )}.<br/>Нажмите ниже для более подробной информации.`,
      buttonText: "Посмотреть детали",
      buttonPath: getJobsLink(job),
      imageUrl: getJobsImageLink(job)
    };
  },
};

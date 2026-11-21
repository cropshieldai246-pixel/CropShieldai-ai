import {
  SAMPLE_SUPPLIERS,
  SIMULATED_WEATHER_PRESETS,
  SimulatedWeatherPreset,
  SupplierProfile,
} from './catalog.ts';

export type SupportedLanguage = 'en' | 'te' | 'hi';

export function normalizeLanguage(input: unknown): SupportedLanguage {
  if (typeof input !== 'string') return 'en';
  const clean = input.trim().toLowerCase();
  if (clean === 'te' || clean.startsWith('te-')) return 'te';
  if (clean === 'hi' || clean.startsWith('hi-')) return 'hi';
  return 'en';
}

export function getLanguageInstructionMeta(lang: SupportedLanguage): {
  name: string;
  scriptInstruction: string;
} {
  if (lang === 'te') {
    return {
      name: 'Telugu (తెలుగు)',
      scriptInstruction:
        'Write clearly in natural, everyday Telugu (తెలుగు script) that Indian farmers can easily read and understand. Keep common crop or technical terms understandable by placing the simple English/local word in parentheses only if helpful.',
    };
  }
  if (lang === 'hi') {
    return {
      name: 'Hindi (हिन्दी)',
      scriptInstruction:
        'Write clearly in natural, everyday Hindi (देवनागरी / हिन्दी script) that Indian farmers can easily read and understand. Keep common crop or technical terms understandable by placing the simple English/local word in parentheses only if helpful.',
    };
  }
  return {
    name: 'English',
    scriptInstruction:
      'Write in simple, clear, beginner-friendly English without dense scientific jargon.',
  };
}

type ServerMessageKey =
  | 'AUTH_REQUIRED'
  | 'SESSION_EXPIRED'
  | 'INVALID_NAME'
  | 'INVALID_IDENTIFIER'
  | 'INVALID_PASSWORD'
  | 'ACCOUNT_EXISTS'
  | 'REGISTER_FAILED'
  | 'MISSING_LOGIN_CREDENTIALS'
  | 'INVALID_LOGIN_CREDENTIALS'
  | 'PROFILE_NOT_FOUND'
  | 'INVALID_CROP_NAME'
  | 'CROP_NOT_FOUND'
  | 'INQUIRY_EMPTY'
  | 'INQUIRY_NOTE'
  | 'MARKETPLACE_NOTICE'
  | 'CHAT_EMPTY'
  | 'CHAT_UNEXPECTED'
  | 'LEAF_MISSING'
  | 'LEAF_UNEXPECTED'
  | 'CROP_REC_REQUIRED'
  | 'CROP_REC_UNEXPECTED'
  | 'API_NOT_FOUND'
  | 'BAD_JSON';

const SERVER_MESSAGES: Record<ServerMessageKey, Record<SupportedLanguage, string>> = {
  AUTH_REQUIRED: {
    en: 'Please sign in to access CropShield AI.',
    te: 'CropShield AI ఉపయోగించడానికి దయచేసి సైన్ ఇన్ చేయండి.',
    hi: 'CropShield AI का उपयोग करने के लिए कृपया साइन इन करें।',
  },
  SESSION_EXPIRED: {
    en: 'Your session has expired. Please sign in again.',
    te: 'మీ సెషన్ గడువు ముగిసింది. దయచేసి మళ్లీ సైన్ ఇన్ చేయండి.',
    hi: 'आपका सत्र समाप्त हो गया है। कृपया फिर से साइन इन करें।',
  },
  INVALID_NAME: {
    en: 'Please enter your full name (at least 2 characters).',
    te: 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి (కనీసం 2 అక్షరాలు).',
    hi: 'कृपया अपना पूरा नाम दर्ज करें (कम से कम 2 अक्षर)।',
  },
  INVALID_IDENTIFIER: {
    en: 'Please enter a valid email address or mobile number.',
    te: 'దయచేసి సరైన ఇమెయిల్ లేదా మొబైల్ నంబర్‌ను నమోదు చేయండి.',
    hi: 'कृपया सही ईमेल पता या मोबाइल नंबर दर्ज करें।',
  },
  INVALID_PASSWORD: {
    en: 'Please choose a password with at least 6 characters.',
    te: 'దయచేసి కనీసం 6 అక్షరాల పాస్‌వర్డ్‌ను ఎంచుకోండి.',
    hi: 'कृपया कम से कम 6 अक्षरों का पासवर्ड चुनें।',
  },
  ACCOUNT_EXISTS: {
    en: 'An account with this email or mobile number already exists. Try signing in.',
    te: 'ఈ ఇమెయిల్ లేదా మొబైల్ నంబర్‌తో ఇప్పటికే ఖాతా ఉంది. సైన్ ఇన్ చేయండి.',
    hi: 'इस ईमेल या मोबाइल नंबर से पहले से खाता मौजूद है। कृपया साइन इन करें।',
  },
  REGISTER_FAILED: {
    en: 'Could not register account. Please try again.',
    te: 'ఖాతాను నమోదు చేయలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.',
    hi: 'खाता पंजीकृत नहीं हो सका। कृपया पुनः प्रयास करें।',
  },
  MISSING_LOGIN_CREDENTIALS: {
    en: 'Please enter both your email/mobile and password.',
    te: 'దయచేసి మీ ఇమెయిల్/మొబైల్ మరియు పాస్‌వర్డ్ రెండింటినీ నమోదు చేయండి.',
    hi: 'कृपया अपना ईमेल/मोबाइल और पासवर्ड दोनों दर्ज करें।',
  },
  INVALID_LOGIN_CREDENTIALS: {
    en: 'Incorrect email/mobile or password. Please check and try again.',
    te: 'తప్పు ఇమెయిల్/మొబైల్ లేదా పాస్‌వర్డ్. దయచేసి సరిచూసి మళ్లీ ప్రయత్నించండి.',
    hi: 'गलत ईमेल/मोबाइल या पासवर्ड। कृपया जांचें और पुनः प्रयास करें।',
  },
  PROFILE_NOT_FOUND: {
    en: 'Farmer profile not found.',
    te: 'రైతు ప్రొఫైల్ కనుగొనబడలేదు.',
    hi: 'किसान प्रोफ़ाइल नहीं मिली।',
  },
  INVALID_CROP_NAME: {
    en: 'Please enter a valid crop name.',
    te: 'దయచేసి సరైన పంట పేరును నమోదు చేయండి.',
    hi: 'कृपया सही फसल का नाम दर्ज करें।',
  },
  CROP_NOT_FOUND: {
    en: 'Crop record not found.',
    te: 'పంట వివరం కనుగొనబడలేదు.',
    hi: 'फसल का रिकॉर्ड नहीं मिला।',
  },
  INQUIRY_EMPTY: {
    en: 'Please write a short inquiry message for the supplier.',
    te: 'దయచేసి విక్రేతకు ఒక చిన్న విచారణ సందేశం రాయండి.',
    hi: 'कृपया विक्रेता के लिए एक छोटा पूछताछ संदेश लिखें।',
  },
  INQUIRY_NOTE: {
    en: 'Demo inquiry logged in your activity history. Direct supplier contact details are displayed for phone or email follow-up.',
    te: 'నమూనా విచారణ మీ కార్యకలాప చరిత్రలో నమోదైంది. ఫోన్ లేదా ఇమెయిల్ ద్వారా సంప్రదించడానికి విక్రేత వివరాలు పైన చూపబడ్డాయి.',
    hi: 'डेमो पूछताछ आपकी गतिविधि इतिहास में दर्ज कर ली गई है। फोन या ईमेल से संपर्क करने के लिए विक्रेता के विवरण ऊपर दिए गए हैं।',
  },
  MARKETPLACE_NOTICE: {
    en: 'Sample supplier directory for hackathon demonstration · No real payment processing.',
    te: 'హ్యాకథాన్ ప్రదర్శన కోసం నమూనా విక్రేతల జాబితా · అసలు చెల్లింపులు లేవు.',
    hi: 'हैकथॉन प्रदर्शन के लिए नमूना विक्रेता सूची · इसमें कोई वास्तविक भुगतान नहीं होता।',
  },
  CHAT_EMPTY: {
    en: 'Please enter a message.',
    te: 'దయచేసి మీ ప్రశ్నను నమోదు చేయండి.',
    hi: 'कृपया अपना प्रश्न लिखें।',
  },
  CHAT_UNEXPECTED: {
    en: 'Unexpected error while contacting the AI assistant.',
    te: 'AI సహాయకుడిని సంప్రదించడంలో అనుకోని లోపం జరిగింది.',
    hi: 'AI सहायक से संपर्क करते समय अप्रत्याशित त्रुटि हुई।',
  },
  LEAF_MISSING: {
    en: 'Please select a crop leaf image first.',
    te: 'దయచేసి ముందుగా పంట ఆకు ఫోటోను ఎంచుకోండి.',
    hi: 'कृपया पहले फसल के पत्ते की तस्वीर चुनें।',
  },
  LEAF_UNEXPECTED: {
    en: 'Unexpected error while analyzing the leaf photo.',
    te: 'ఆకు ఫోటోను విశ్లేషించడంలో అనుకోని లోపం జరిగింది.',
    hi: 'पत्ते की तस्वीर का विश्लेषण करते समय अप्रत्याशित त्रुटि हुई।',
  },
  CROP_REC_REQUIRED: {
    en: 'Please fill in Location, Soil Type, Water Availability, and Season.',
    te: 'దయచేసి ప్రాంతం, నేల రకం, నీటి లభ్యత మరియు పంట కాలాన్ని పూరించండి.',
    hi: 'कृपया स्थान, मिट्टी का प्रकार, पानी की उपलब्धता और मौसम भरें।',
  },
  CROP_REC_UNEXPECTED: {
    en: 'Unexpected error while generating crop recommendations.',
    te: 'పంట సూచనలను రూపొందించడంలో అనుకోని లోపం జరిగింది.',
    hi: 'फसल सुझाव तैयार करते समय अप्रत्याशित त्रुटि हुई।',
  },
  API_NOT_FOUND: {
    en: 'Requested API endpoint was not found.',
    te: 'అభ్యర్థించిన API మార్గం కనుగొనబడలేదు.',
    hi: 'अनुरोधित API एंडपॉइंट नहीं मिला।',
  },
  BAD_JSON: {
    en: 'Invalid JSON request body sent to server.',
    te: 'సర్వర్‌కు పంపిన అభ్యర్థన ఫార్మాట్ సరైనది కాదు.',
    hi: 'सर्वर को भेजा गया अनुरोध प्रारूप मान्य नहीं है।',
  },
};

export function getServerMessage(key: ServerMessageKey, lang: SupportedLanguage): string {
  return SERVER_MESSAGES[key][lang] || SERVER_MESSAGES[key].en;
}

const WEATHER_TRANSLATIONS: Record<
  string,
  Record<
    'te' | 'hi',
    { regionLabel: string; condition: string; farmingTip: string; disclaimer: string }
  >
> = {
  Maharashtra: {
    te: {
      regionLabel: 'నాసిక్ / పశ్చిమ మహారాష్ట్ర',
      condition: 'తేలికపాటి ఎండ మరియు గాలి',
      farmingTip: 'ఉదయం ఆకుల తనిఖీ మరియు బిందు సేద్యం (డ్రిప్) పైపులను సరిచూడటానికి మంచి సమయం.',
      disclaimer: 'ప్రదర్శన కోసం నమూనా వాతావరణ సమాచారం — మందులు చల్లే ముందు స్థానిక IMD వాతావరణాన్ని చూడండి.',
    },
    hi: {
      regionLabel: 'नासिक / पश्चिमी महाराष्ट्र',
      condition: 'हल्की धूप और सुहावनी हवा',
      farmingTip: 'सुबह पत्तियों की जांच और ड्रिप सिंचाई प्रणाली की जांच के लिए अच्छा समय है।',
      disclaimer: 'प्रदर्शन के लिए नमूना मौसम डेटा — छिड़काव से पहले स्थानीय IMD मौसम पूर्वानुमान अवश्य देखें।',
    },
  },
  Punjab: {
    te: {
      regionLabel: 'లుధియానా / మధ్య మైదానాలు',
      condition: 'నిర్మలమైన ఆకాశం మరియు మితమైన వాతావరణం',
      farmingTip: 'గోధుమ పొలం తయారీ మరియు నేల పరీక్షకు అనుకూలమైన పొడి వాతావరణం.',
      disclaimer: 'ప్రదర్శన కోసం నమూనా వాతావరణ సమాచారం — మందులు చల్లే ముందు స్థానిక IMD వాతావరణాన్ని చూడండి.',
    },
    hi: {
      regionLabel: 'लुधियाना / मध्य मैदानी क्षेत्र',
      condition: 'साफ मौसम और मध्यम तापमान',
      farmingTip: 'गेहूं के खेत की तैयारी और मिट्टी परीक्षण के लिए अनुकूल शुष्क मौसम।',
      disclaimer: 'प्रदर्शन के लिए नमूना मौसम डेटा — छिड़काव से पहले स्थानीय IMD मौसम पूर्वानुमान अवश्य देखें।',
    },
  },
  'Uttar Pradesh': {
    te: {
      regionLabel: 'లక్నో / గంగా మైదానం',
      condition: 'పాక్షికంగా మేఘావృతం',
      farmingTip: 'పొలం నీటి పారుదల కాలువలను తనిఖీ చేయండి మరియు తేమగా ఉన్న ఉదయం వేళ ఆకు మచ్చలను గమనించండి.',
      disclaimer: 'ప్రదర్శన కోసం నమూనా వాతావరణ సమాచారం — మందులు చల్లే ముందు స్థానిక IMD వాతావరణాన్ని చూడండి.',
    },
    hi: {
      regionLabel: 'लखनऊ / गंगा का मैदानी क्षेत्र',
      condition: 'आंशिक रूप से बादल छाए हुए',
      farmingTip: 'खेत की जल निकासी नालियों की जांच करें और नमी वाली सुबह में पत्तियों के धब्बों पर नज़र रखें।',
      disclaimer: 'प्रदर्शन के लिए नमूना मौसम डेटा — छिड़काव से पहले स्थानीय IMD मौसम पूर्वानुमान अवश्य देखें।',
    },
  },
  Karnataka: {
    te: {
      regionLabel: 'మాండ్య / దక్షిణ పీఠభూమి',
      condition: 'వెచ్చగా మరియు చెదురుమదురు మేఘాలు',
      farmingTip: 'కూరగాయల మొక్కల చుట్టూ ఎండు గడ్డి మల్చింగ్ వేసి నేల తేమను కాపాడటానికి ఇది మంచి సమయం.',
      disclaimer: 'ప్రదర్శన కోసం నమూనా వాతావరణ సమాచారం — మందులు చల్లే ముందు స్థానిక IMD వాతావరణాన్ని చూడండి.',
    },
    hi: {
      regionLabel: 'मांड्या / दक्षिणी पठार',
      condition: 'गर्म मौसम और हल्के बादल',
      farmingTip: 'सब्जियों की क्यारियों के चारों ओर मल्चिंग करके मिट्टी की नमी बचाने के लिए उपयुक्त समय।',
      disclaimer: 'प्रदर्शन के लिए नमूना मौसम डेटा — छिड़काव से पहले स्थानीय IMD मौसम पूर्वानुमान अवश्य देखें।',
    },
  },
  'Tamil Nadu': {
    te: {
      regionLabel: 'తంజావూరు / కావేరి డెల్టా',
      condition: 'తేమతో కూడిన తీరప్రాంత గాలి',
      farmingTip: 'వరి పొలం గట్లను శుభ్రంగా ఉంచండి మరియు కింది ఆకులపై పొట్టు లేదా ఫంగస్ లక్షణాలను గమనించండి.',
      disclaimer: 'ప్రదర్శన కోసం నమూనా వాతావరణ సమాచారం — మందులు చల్లే ముందు స్థానిక IMD వాతావరణాన్ని చూడండి.',
    },
    hi: {
      regionLabel: 'तंजावुर / कावेरी डेल्टा',
      condition: 'नमी भरी तटीय हवा',
      farmingTip: 'धान की मेड़ें साफ रखें और निचली पत्तियों पर फफूंद या धब्बों की जांच करें।',
      disclaimer: 'प्रदर्शन के लिए नमूना मौसम डेटा — छिड़काव से पहले स्थानीय IMD मौसम पूर्वानुमान अवश्य देखें।',
    },
  },
  'Madhya Pradesh': {
    te: {
      regionLabel: 'ఇండోర్ / మాల్వా పీఠభూమి',
      condition: 'పొడి మరియు ప్రకాశవంతమైన ఎండ',
      farmingTip: 'నీరు ఆవిరి కాకుండా ఉండటానికి ఉదయం వేళ లేదా సాయంత్రం చల్లబడిన తర్వాత నీరు పెట్టండి.',
      disclaimer: 'ప్రదర్శన కోసం నమూనా వాతావరణ సమాచారం — మందులు చల్లే ముందు స్థానిక IMD వాతావరణాన్ని చూడండి.',
    },
    hi: {
      regionLabel: 'इंदौर / मालवा पठार',
      condition: 'शुष्क और तेज धूप',
      farmingTip: 'पानी के वाष्पीकरण को कम करने के लिए सुबह जल्दी या शाम को सिंचाई करें।',
      disclaimer: 'प्रदर्शन के लिए नमूना मौसम डेटा — छिड़काव से पहले स्थानीय IMD मौसम पूर्वानुमान अवश्य देखें।',
    },
  },
};

export function getLocalizedWeatherPresets(lang: SupportedLanguage): SimulatedWeatherPreset[] {
  if (lang === 'en') return SIMULATED_WEATHER_PRESETS;
  return SIMULATED_WEATHER_PRESETS.map((preset) => {
    const tr = WEATHER_TRANSLATIONS[preset.state]?.[lang];
    return tr ? { ...preset, ...tr } : preset;
  });
}

const SUPPLIER_TRANSLATIONS: Record<
  string,
  Record<
    'te' | 'hi',
    {
      location: string;
      specialization: string;
      responseTime: string;
      products: Record<
        string,
        { name: string; packSize: string; description: string; usageNote: string }
      >;
    }
  >
> = {
  sup_sahayadri: {
    te: {
      location: 'నాసిక్, మహారాష్ట్ర',
      specialization: 'ధృవీకరించబడిన విత్తనాలు & సేంద్రియ వేప ఉత్పత్తులు',
      responseTime: 'సాధారణంగా 4 గంటల్లో స్పందిస్తారు',
      products: {
        prod_1: {
          name: 'వేప పిండి సేంద్రియ నేల పోషకం',
          packSize: '25 కిలోల సంచి',
          description: 'నేల ఆకృతిని మరియు వేర్ల బలాన్ని మెరుగుపరిచే సహజ పోషకాలు గల చల్లని-పీడన వేప పిండి.',
          usageNote: 'విత్తనాలు వేసే ముందు దుక్కి సమయంలో పైమట్టిలో కలపండి.',
        },
        prod_2: {
          name: 'వేప నూనె జీవ-స్ప్రే (1500 ppm)',
          packSize: '1 లీటరు బాటిల్',
          description: 'కూరగాయల పంటలలో పేనుబంక, తెల్లదోమ మరియు నల్లి నివారణకు ఉపయోగపడే సేంద్రియ స్ప్రే.',
          usageNote: 'ప్యాకెట్ సూచనల ప్రకారం నీటిలో కలిపి సాయంత్రం చల్లని వేళలో చల్లండి.',
        },
      },
    },
    hi: {
      location: 'नासिक, महाराष्ट्र',
      specialization: 'प्रमाणित बीज और जैविक नीम उत्पाद',
      responseTime: 'आमतौर पर 4 घंटे में जवाब मिलता है',
      products: {
        prod_1: {
          name: 'नीम खली जैविक मिट्टी कंडीशनर',
          packSize: '25 किग्रा बोरी',
          description: 'मिट्टी की संरचना और जड़ों की मजबूती सुधारने के लिए प्राकृतिक सूक्ष्म पोषक तत्वों से भरपूर कोल्ड-प्रेस्ड नीम खली।',
          usageNote: 'बुवाई से पहले खेत की तैयारी के समय ऊपरी मिट्टी में मिलाएं।',
        },
        prod_2: {
          name: 'कोल्ड-प्रेस्ड नीम तेल बायो-स्प्रे (1500 ppm)',
          packSize: '1 लीटर बोतल',
          description: 'सब्जियों की फसलों में माहू, सफेद मक्खी और माइट्स की शुरुआती रोकथाम के लिए जैविक स्प्रे।',
          usageNote: 'पैकेट पर दिए निर्देशानुसार पानी में घोलें और शाम के ठंडे समय में छिड़काव करें।',
        },
      },
    },
  },
  sup_greenharvest: {
    te: {
      location: 'లుధియానా, పంజాబ్',
      specialization: 'అధిక మొలక శాతం గల ధాన్యం & పప్పుధాన్యాల విత్తనాలు',
      responseTime: 'సాధారణంగా అదే రోజు స్పందిస్తారు',
      products: {
        prod_3: {
          name: 'HD-2967 ధృవీకరించబడిన గోధుమ విత్తనం',
          packSize: '40 కిలోల బస్తా',
          description: 'మంచి పిలకలు వేసే గుణం మరియు పసుపు కుంకుమ తెగులును తట్టుకునే ప్రముఖ రబీ గోధుమ రకం.',
          usageNote: 'నీటిపారుదల గల ఒండ్రు నేలల్లో నవంబర్‌లో విత్తడానికి అనుకూలం.',
        },
        prod_4: {
          name: 'పూసా బాస్మతి 1509 వరి విత్తనం',
          packSize: '10 కిలోల బస్తా',
          description: 'చివరి దశలో నీటిని ఆదా చేయడానికి సహాయపడే స్వల్పకాలిక సువాసనగల వరి రకం.',
          usageNote: 'నాట్లు వేసే ముందు 21–25 రోజులు ఆరోగ్యకరమైన నారుమడి పెంచండి.',
        },
      },
    },
    hi: {
      location: 'लुधियाना, पंजाब',
      specialization: 'उच्च अंकुरण वाले अनाज और दलहन बीज',
      responseTime: 'आमतौर पर उसी दिन जवाब मिलता है',
      products: {
        prod_3: {
          name: 'HD-2967 प्रमाणित गेहूं बीज',
          packSize: '40 किग्रा बोरी',
          description: 'अच्छी कल्ले निकलने की क्षमता और पीला रतुआ के प्रति अच्छी सहनशीलता वाली लोकप्रिय रबी गेहूं किस्म।',
          usageNote: 'सिंचित दोमट मैदानों में नवंबर में समय पर बुवाई के लिए उपयुक्त।',
        },
        prod_4: {
          name: 'पूसा बासमती 1509 धान बीज',
          packSize: '10 किग्रा बैग',
          description: 'कम अवधि में पकने वाली सुगंधित धान किस्म जो आखिरी चरण में सिंचाई के पानी की बचत करती है।',
          usageNote: 'रोपाई से पहले 21–25 दिनों तक स्वस्थ नर्सरी पौध तैयार करें।',
        },
      },
    },
  },
  sup_kaveri_drip: {
    te: {
      location: 'కోయంబత్తూరు, తమిళనాడు',
      specialization: 'నీటిని ఆదా చేసే డ్రిప్ కిట్లు & నేల తేమ పరికరాలు',
      responseTime: 'సాధారణంగా 6 గంటల్లో స్పందిస్తారు',
      products: {
        prod_5: {
          name: '0.5 ఎకరా కూరగాయల గ్రావిటీ డ్రిప్ కిట్',
          packSize: 'పూర్తి స్టార్టర్ కిట్',
          description: 'చిన్న కూరగాయల పొలాల కోసం సులభంగా అమర్చుకోగల ఇన్‌లైన్ డ్రిప్ పైపులు, ఫిల్టర్ మరియు ఫిట్టింగ్‌లు.',
          usageNote: 'నేరుగా వేర్ల వద్దకు నీటిని అందిస్తుంది మరియు ఆకులను పొడిగా ఉంచుతుంది.',
        },
        prod_6: {
          name: 'నేల pH & తేమ తనిఖీ ప్రోబ్ పరికరం',
          packSize: '1 యూనిట్ (బ్యాటరీ అవసరం లేదు)',
          description: 'నీరు పెట్టే ముందు పైమట్టి తేమ మరియు సుమారు pH విలువను త్వరగా చూడటానికి ఉపయోగపడే పరికరం.',
          usageNote: 'ప్రతి పరీక్ష ముందు మరియు తర్వాత లోహపు కొనను శుభ్రంగా తుడవండి; ఖచ్చితమైన NPK కోసం ల్యాబ్ సాయిల్ హెల్త్ కార్డ్ చేయించండి.',
        },
      },
    },
    hi: {
      location: 'कोयंबटूर, तमिलनाडु',
      specialization: 'पानी बचाने वाली ड्रिप किट और मिट्टी की नमी जांच उपकरण',
      responseTime: 'आमतौर पर 6 घंटे में जवाब मिलता है',
      products: {
        prod_5: {
          name: '0.5 एकड़ सब्जी ग्रेविटी ड्रिप सिंचाई किट',
          packSize: 'पूरा स्टार्टर किट',
          description: 'छोटे सब्जी के खेतों के लिए आसानी से लगने वाले ड्रिप पाइप, स्क्रीन फिल्टर और फिटिंग्स।',
          usageNote: 'सीधे जड़ों तक पानी पहुंचाती है और पत्तियों को सूखा रखकर रोग कम करती है।',
        },
        prod_6: {
          name: 'मैनुअल मिट्टी pH और नमी जांच मीटर',
          packSize: '1 यूनिट (बिना बैटरी)',
          description: 'सिंचाई से पहले ऊपरी मिट्टी की नमी और अनुमानित pH की तुरंत जांच करने वाला उपकरण।',
          usageNote: 'हर जांच से पहले और बाद में धातु की नोक साफ करें; सटीक NPK के लिए सॉइल हेल्थ कार्ड लैब टेस्ट कराएं।',
        },
      },
    },
  },
  sup_bhumi_bio: {
    te: {
      location: 'ఇండోర్, మధ్యప్రదేశ్',
      specialization: 'వర్మీకంపోస్ట్ & సూక్ష్మజీవ జీవ-ఎరువులు',
      responseTime: 'సాధారణంగా 3 గంటల్లో స్పందిస్తారు',
      products: {
        prod_7: {
          name: 'శ్రేష్ఠమైన వర్మీకంపోస్ట్ (వానపాముల ఎరువు)',
          packSize: '50 కిలోల బస్తా',
          description: 'నేలలో నీటిని నిల్వ ఉంచే శక్తిని మరియు ఉపయోగకరమైన సూక్ష్మజీవులను పెంచే బాగా మగ్గిన సేంద్రియ ఎరువు.',
          usageNote: 'మొక్క వేర్ల చుట్టూ వేయండి లేదా ప్రాథమిక ఎరువుతో కలిపి వాడండి.',
        },
        prod_8: {
          name: 'ట్రైకోడెర్మా విరిడే జీవ-సంరక్షక పొడి',
          packSize: '1 కిలో పౌచ్',
          description: 'నేల ద్వారా వచ్చే వేరు తెగుళ్ల నుండి రక్షణకు కంపోస్ట్ లేదా విత్తన శుద్ధితో ఉపయోగించే మేలు చేసే శిలీంధ్రం.',
          usageNote: 'నేరుగా ఎండ తగలని చల్లని, పొడి నీడలో నిల్వ ఉంచండి.',
        },
      },
    },
    hi: {
      location: 'इंदौर, मध्य प्रदेश',
      specialization: 'वर्मीकम्पोस्ट और सूक्ष्मजीवी जैव-उर्वरक',
      responseTime: 'आमतौर पर 3 घंटे में जवाब मिलता है',
      products: {
        prod_7: {
          name: 'समृद्ध वर्मीकम्पोस्ट (केंचुआ खाद)',
          packSize: '50 किग्रा बैग',
          description: 'मिट्टी में नमी रोकने की क्षमता और लाभकारी सूक्ष्मजीवों को बढ़ाने वाली अच्छी तरह पकी केंचुआ खाद।',
          usageNote: 'जड़ों के आसपास डालें या बुवाई के समय बेसल खाद के साथ मिलाएं।',
        },
        prod_8: {
          name: 'ट्राइकोडर्मा विरिडी जैव-सुरक्षा पाउडर',
          packSize: '1 किग्रा पाउच',
          description: 'मिट्टी से होने वाले जड़ रोगों से बचाव के लिए कम्पोस्ट या बीज उपचार के साथ उपयोग होने वाला लाभकारी फफूंद।',
          usageNote: 'सीधी धूप से दूर ठंडी और सूखी छायादार जगह पर रखें।',
        },
      },
    },
  },
};

export function getLocalizedSuppliers(lang: SupportedLanguage): SupplierProfile[] {
  if (lang === 'en') return SAMPLE_SUPPLIERS;
  return SAMPLE_SUPPLIERS.map((sup) => {
    const tr = SUPPLIER_TRANSLATIONS[sup.id]?.[lang];
    if (!tr) return sup;
    return {
      ...sup,
      location: tr.location,
      specialization: tr.specialization,
      responseTime: tr.responseTime,
      products: sup.products.map((prod) => {
        const ptr = tr.products[prod.id];
        return ptr ? { ...prod, ...ptr } : prod;
      }),
    };
  });
}

import { AppLanguage, LeafAnalysisResult, SupplierProduct, TrackedCrop } from '../types';

export const LANGUAGE_OPTIONS: Array<{
  code: AppLanguage;
  nativeLabel: string;
  shortLabel: string;
}> = [
  { code: 'en', nativeLabel: 'English', shortLabel: 'EN' },
  { code: 'te', nativeLabel: 'తెలుగు', shortLabel: 'తె' },
  { code: 'hi', nativeLabel: 'हिन्दी', shortLabel: 'हि' },
];

export const STATE_LABELS: Record<string, Record<AppLanguage, string>> = {
  Maharashtra: { en: 'Maharashtra', te: 'మహారాష్ట్ర', hi: 'महाराष्ट्र' },
  Punjab: { en: 'Punjab', te: 'పంజాబ్', hi: 'पंजाब' },
  'Uttar Pradesh': { en: 'Uttar Pradesh', te: 'ఉత్తర ప్రదేశ్', hi: 'उत्तर प्रदेश' },
  Karnataka: { en: 'Karnataka', te: 'కర్ణాటక', hi: 'कर्नाटक' },
  'Tamil Nadu': { en: 'Tamil Nadu', te: 'తమిళనాడు', hi: 'तमिलनाडु' },
  'Madhya Pradesh': { en: 'Madhya Pradesh', te: 'మధ్య ప్రదేశ్', hi: 'मध्य प्रदेश' },
  Gujarat: { en: 'Gujarat', te: 'గుజరాత్', hi: 'गुजरात' },
  'Andhra Pradesh': { en: 'Andhra Pradesh', te: 'ఆంధ్ర ప్రదేశ్', hi: 'आंध्र प्रदेश' },
  Telangana: { en: 'Telangana', te: 'తెలంగాణ', hi: 'तेलंगाना' },
  'West Bengal': { en: 'West Bengal', te: 'పశ్చిమ బెంగాల్', hi: 'पश्चिम बंगाल' },
  Rajasthan: { en: 'Rajasthan', te: 'రాజస్థాన్', hi: 'राजस्थान' },
  Bihar: { en: 'Bihar', te: 'బీహార్', hi: 'बिहार' },
  Haryana: { en: 'Haryana', te: 'హర్యానా', hi: 'हरियाणा' },
};

export const SOIL_LABELS: Record<string, Record<AppLanguage, string>> = {
  Loamy: {
    en: 'Loamy',
    te: 'ఒండ్రు-ఇసుక మిశ్రమ నేల (Loamy)',
    hi: 'दोमट मिट्टी (Loamy)',
  },
  'Black Cotton (Vertisol)': {
    en: 'Black Cotton (Vertisol)',
    te: 'నల్ల రేగడి నేల (Black Cotton)',
    hi: 'काली कपास मिट्टी (Black Cotton)',
  },
  Alluvial: {
    en: 'Alluvial',
    te: 'ఒండ్రు నేల (Alluvial)',
    hi: 'जलोढ़ मिट्टी (Alluvial)',
  },
  'Red & Yellow': {
    en: 'Red & Yellow',
    te: 'ఎర్ర మరియు పసుపు నేల',
    hi: 'लाल और पीली मिट्टी',
  },
  Clay: {
    en: 'Clay',
    te: 'బంకమన్ను నేల (Clay)',
    hi: 'चिकनी मिट्टी (Clay)',
  },
  'Sandy Loam': {
    en: 'Sandy Loam',
    te: 'ఇసుక ఒండ్రు నేల',
    hi: 'बलुई दोमट मिट्टी',
  },
  Laterite: {
    en: 'Laterite',
    te: 'ఎర్ర రాతి నేల (Laterite)',
    hi: 'लैटेराइट मिट्टी',
  },
};

export const WATER_OPTION_LABELS: Record<string, Record<AppLanguage, string>> = {
  'Rainfed Only (Monsoon dependent)': {
    en: 'Rainfed Only (Monsoon dependent)',
    te: 'వర్షాధారం మాత్రమే (రుతుపవనాలపై ఆధారం)',
    hi: 'केवल वर्षा आधारित (मानसून पर निर्भर)',
  },
  'Seasonal Borewell / Well Irrigation': {
    en: 'Seasonal Borewell / Well Irrigation',
    te: 'కాలానుగుణ బోరుబావి / బావి నీటిపారుదల',
    hi: 'मौसमी बोरवेल / कुएं की सिंचाई',
  },
  'Canal + Supplemental Irrigation': {
    en: 'Canal + Supplemental Irrigation',
    te: 'కాలువ + అదనపు నీటిపారుదల',
    hi: 'नहर + सहायक सिंचाई',
  },
  'Drip / Assured Year-Round Irrigation': {
    en: 'Drip / Assured Year-Round Irrigation',
    te: 'బిందు సేద్యం (డ్రిప్) / ఏడాది పొడవునా నీటి వసతి',
    hi: 'ड्रिप / पूरे वर्ष सुनिश्चित सिंचाई',
  },
};

export const ADVISOR_SEASON_LABELS: Record<string, Record<AppLanguage, string>> = {
  'Kharif (June – October)': {
    en: 'Kharif (June – October)',
    te: 'ఖరీఫ్ (జూన్ – అక్టోబర్)',
    hi: 'खरीफ (जून – अक्टूबर)',
  },
  'Rabi (November – March)': {
    en: 'Rabi (November – March)',
    te: 'రబీ (నవంబర్ – మార్చి)',
    hi: 'रबी (नवंबर – मार्च)',
  },
  'Zaid (March – June)': {
    en: 'Zaid (March – June)',
    te: 'జైద్ / వేసవి (మార్చి – జూన్)',
    hi: 'जायद / गर्मी (मार्च – जून)',
  },
};

export const CROP_SEASON_LABELS: Record<TrackedCrop['season'], Record<AppLanguage, string>> = {
  Kharif: { en: 'Kharif (Monsoon)', te: 'ఖరీఫ్ (వర్షాకాలం)', hi: 'खरीफ (मानसून)' },
  Rabi: { en: 'Rabi (Winter)', te: 'రబీ (శీతాకాలం)', hi: 'रबी (सर्दी)' },
  Zaid: { en: 'Zaid (Summer)', te: 'జైద్ (వేసవి)', hi: 'जायद (गर्मी)' },
  Perennial: { en: 'Perennial', te: 'బహువార్షిక పంట', hi: 'बारहमासी' },
};

export const CATEGORY_LABELS: Record<'All' | SupplierProduct['category'], Record<AppLanguage, string>> = {
  All: { en: 'All', te: 'అన్నీ', hi: 'सभी' },
  Seeds: { en: 'Seeds', te: 'విత్తనాలు', hi: 'बीज' },
  'Bio-Fertilizers': { en: 'Bio-Fertilizers', te: 'జీవ ఎరువులు', hi: 'जैव-उर्वरक' },
  'Organic Care': { en: 'Organic Care', te: 'సేంద్రియ సంరక్షణ', hi: 'जैविक सुरक्षा' },
  Irrigation: { en: 'Irrigation', te: 'నీటిపారుదల', hi: 'सिंचाई' },
  'Soil Tools': { en: 'Soil Tools', te: 'నేల పరికరాలు', hi: 'मिट्टी उपकरण' },
};

export const CONFIDENCE_LABELS: Record<LeafAnalysisResult['confidenceLevel'], Record<AppLanguage, string>> = {
  Low: { en: 'Low', te: 'తక్కువ (Low)', hi: 'कम (Low)' },
  Moderate: { en: 'Moderate', te: 'మధ్యస్థం (Moderate)', hi: 'मध्यम (Moderate)' },
  High: { en: 'High', te: 'అధికం (High)', hi: 'अधिक (High)' },
};

export const SAMPLE_CROP_TRANSLATIONS: Record<
  string,
  Record<'te' | 'hi', { cropName: string; sowingStage: string; notes: string }>
> = {
  'Paddy (Rice)': {
    te: {
      cropName: 'వరి (Paddy)',
      sowingStage: 'పిలక దశ (రోజు 38)',
      notes: 'నమూనా పంట · 3–5 సెం.మీ నిల్వ నీటిని ఉంచి వారానికి ఒకసారి ఆకుల చివర్లను పరిశీలించండి.',
    },
    hi: {
      cropName: 'धान (Paddy / Rice)',
      sowingStage: 'वानस्पतिक वृद्धि (दिन 38)',
      notes: 'नमूना फसल · खेत में 3–5 सेमी पानी बनाए रखें और हर सप्ताह पत्तियों के सिरों की जांच करें।',
    },
  },
  Wheat: {
    te: {
      cropName: 'గోధుమ (Wheat)',
      sowingStage: 'విత్తడానికి ప్రణాళికలో ఉంది',
      notes: 'నమూనా పంట · మెత్తని దుక్కి సిద్ధం చేసి విత్తే ముందు నేల తేమను సరిచూడండి.',
    },
    hi: {
      cropName: 'गेहूं (Wheat)',
      sowingStage: 'बुवाई के लिए प्रस्तावित',
      notes: 'नमूना फसल · भुरभुरी क्यारी तैयार करें और बुवाई से पहले मिट्टी की नमी जांचें।',
    },
  },
  Tomato: {
    te: {
      cropName: 'టమోటా (Tomato)',
      sowingStage: 'పూత మరియు పిందె దశ',
      notes: 'నమూనా పంట · ఆకులపై ఫంగస్ మచ్చలు తగ్గించడానికి ఉదయం మొక్క మొదట్లోనే నీరు పెట్టండి.',
    },
    hi: {
      cropName: 'टमाटर (Tomato)',
      sowingStage: 'फूल और शुरुआती फल अवस्था',
      notes: 'नमूना फसल · पत्तियों पर फफूंद के धब्बे कम करने के लिए सुबह पौधे की जड़ के पास पानी दें।',
    },
  },
};

export interface AppTranslations {
  brand: string;
  tagline: string;
  languageLabel: string;
  nav: {
    dashboard: string;
    assistant: string;
    disease: string;
    advisor: string;
    marketplace: string;
    profile: string;
    signOut: string;
    openMenu: string;
    closeMenu: string;
    sidebarFooterTagline: string;
  };
  auth: {
    heroAlt: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBullet1: string;
    heroBullet2: string;
    heroFooter: string;
    loginTitle: string;
    registerTitle: string;
    loginSubtitle: string;
    registerSubtitle: string;
    tabSignIn: string;
    tabRegister: string;
    emailOrMobile: string;
    emailOrMobilePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    signingIn: string;
    signInBtn: string;
    fullName: string;
    fullNamePlaceholder: string;
    emailOrMobileShort: string;
    mobilePlaceholder: string;
    passwordMin: string;
    passwordCreatePlaceholder: string;
    village: string;
    villagePlaceholder: string;
    district: string;
    districtPlaceholder: string;
    state: string;
    farmSize: string;
    soilType: string;
    mainCrops: string;
    mainCropsPlaceholder: string;
    defaultMainCropsValue: string;
    creatingProfile: string;
    createAccountBtn: string;
    demoBtn: string;
    storageNotice: string;
    loginFallbackError: string;
    registerFallbackError: string;
    demoFallbackError: string;
  };
  dashboard: {
    heroAlt: string;
    greetingPrefix: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    scanLeafBtn: string;
    askAiBtn: string;
    loadError: string;
    saveCropError: string;
    deleteCropError: string;
    cardAssistantTitle: string;
    cardAssistantDesc: string;
    cardDiseaseTitle: string;
    cardDiseaseDesc: string;
    cardAdvisorTitle: string;
    cardAdvisorDesc: string;
    cardMarketplaceTitle: string;
    cardMarketplaceDesc: string;
    farmerProfileTitle: string;
    editProfile: string;
    farmerName: string;
    location: string;
    farmArea: string;
    acresUnit: string;
    soilType: string;
    primaryCrops: string;
    notListed: string;
    demoFooterNote: string;
    accountIdLabel: string;
    weatherTitle: string;
    simulatedBadge: string;
    selectWeatherStateAria: string;
    sampleSuffix: string;
    loadingWeather: string;
    tempLabel: string;
    humidityLabel: string;
    monthlyRainLabel: string;
    windLabel: string;
    fieldTipLabel: string;
    myCropsTitle: string;
    myCropsSubtitle: string;
    addCropBtn: string;
    cancelBtn: string;
    cropNameLabel: string;
    cropNamePlaceholder: string;
    varietyLabel: string;
    varietyPlaceholder: string;
    seasonLabel: string;
    areaAcresLabel: string;
    growthStageLabel: string;
    defaultGrowthStage: string;
    growthStagePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    savingCropBtn: string;
    saveCropBtn: string;
    noCropsYet: string;
    addFirstCropBtn: string;
    removeCropAria: string;
    stageLabel: string;
    sampleCropNote: string;
    recentActivityTitle: string;
    viewAllBtn: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    shareContextLabel: string;
    newChatBtn: string;
    starterQuestions: string[];
    welcomeMessage: (name: string) => string;
    assistantBrand: string;
    thinkingText: string;
    inputPlaceholder: string;
    inputAria: string;
    sendBtn: string;
    advisoryFooter: string;
    emptyResponseError: string;
    signOutHint: string;
    unexpectedErrorPrefix: string;
    genericFallbackError: string;
  };
  disease: {
    title: string;
    subtitle: string;
    trySampleBtn: string;
    step1Title: string;
    previewAlt: string;
    changePhotoText: string;
    selectPhotoTitle: string;
    selectPhotoHint: string;
    cropHintLabel: string;
    cropHintPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    analyzingBtn: string;
    analyzeBtn: string;
    disclaimer: string;
    step2Title: string;
    emptyTitle: string;
    emptyDesc: string;
    loadingDesc: string;
    screeningBadgePrefix: string;
    notLeafWarning: string;
    possibleCropLabel: string;
    confidenceUncertaintyLabel: string;
    confidencePrefix: string;
    visibleSymptomsTitle: string;
    noSymptomsNote: string;
    possibleConditionsTitle: string;
    preventiveTitle: string;
    kvkFooter: string;
    errInvalidFileType: string;
    errMaxSize: string;
    errReadFailed: string;
    errLoadSample: string;
    errNoImage: string;
    errFallback: string;
  };
  advisor: {
    title: string;
    subtitle: string;
    fillSampleBtn: string;
    formTitle: string;
    simulatedBanner: string;
    locationLabel: string;
    locationPlaceholder: string;
    sampleLocationValue: string;
    soilTypeLabel: string;
    soilPhLabel: string;
    soilPhPlaceholder: string;
    temperatureLabel: string;
    rainfallLabel: string;
    waterLabel: string;
    seasonLabel: string;
    generatingBtn: string;
    submitBtn: string;
    honestyNote: string;
    emptyTitle: string;
    emptyDesc: string;
    loadingDesc: string;
    resultsSimulatedNote: string;
    whySuitableTitle: string;
    soilWaterNotesTitle: string;
    cautionTitle: string;
    generalAdvisoryLabel: string;
    missingContextLabel: string;
    errFallback: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    defaultNotice: string;
    imageAlt: string;
    searchPlaceholder: string;
    searchAria: string;
    loadingText: string;
    noResults: string;
    resetFilters: string;
    ownerPrefix: string;
    yearsActiveSuffix: string;
    sampleListing: string;
    specializationPrefix: string;
    contactSupplierBtn: string;
    usageNotePrefix: string;
    contactModalTitlePrefix: string;
    sampleSupplierContact: string;
    closeModalAria: string;
    selectedProductPrefix: string;
    indicativePricePrefix: string;
    inquiryRecordedTitle: string;
    yourInquiryLabel: string;
    cancelBtn: string;
    sendingBtn: string;
    sendInquiryBtn: string;
    demoNoticeFooter: string;
    defaultProductInquiry: (owner: string, product: string, pack: string) => string;
    defaultSupplierInquiry: (owner: string) => string;
    errLoad: string;
    errInquiry: string;
  };
  profile: {
    title: string;
    errUpdate: string;
    savedNotice: string;
    languagePreferenceLabel: string;
    farmerNameLabel: string;
    villageLabel: string;
    districtLabel: string;
    stateLabel: string;
    farmSizeLabel: string;
    soilTypeLabel: string;
    primaryCropsLabel: string;
    savingBtn: string;
    saveBtn: string;
    historyTitle: string;
    historyEmpty: string;
    activityTypeLabel: Record<'disease_check' | 'crop_recommendation' | 'supplier_inquiry', string>;
  };
}

export const TRANSLATIONS: Record<AppLanguage, AppTranslations> = {
  en: {
    brand: 'CropShield AI',
    tagline: 'Smarter Farming, Healthier Crops, Better Future.',
    languageLabel: 'Language',
    nav: {
      dashboard: 'Dashboard',
      assistant: 'Farming Assistant',
      disease: 'Disease Detection',
      advisor: 'Crop Advisor',
      marketplace: 'Marketplace',
      profile: 'Farmer Profile',
      signOut: 'Sign Out',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation menu',
      sidebarFooterTagline: 'Smarter Farming · Healthier Crops',
    },
    auth: {
      heroAlt: 'Sunlit green Indian agricultural fields at dawn',
      heroTitle: 'Smarter Farming, Healthier Crops, Better Future.',
      heroSubtitle:
        'Built for Indian farmers with simple multilingual guidance, leaf photo screening, crop selection support, and local input supplier connections.',
      heroBullet1: 'Upload leaf photos for AI visual symptom observations and preventive care steps',
      heroBullet2: 'Honest AI guidance that asks clarifying questions and respects local agronomists',
      heroFooter: 'CropShield AI · Agricultural Decision Support Platform',
      loginTitle: 'Farmer Sign In',
      registerTitle: 'Farmer Registration',
      loginSubtitle: 'Access your farm dashboard and AI crop tools.',
      registerSubtitle: 'Create your farm profile in under a minute.',
      tabSignIn: 'Sign In',
      tabRegister: 'Register',
      emailOrMobile: 'Email or Mobile Number',
      emailOrMobilePlaceholder: 'e.g. ramesh@farm.in or 9876543210',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      signingIn: 'Signing In...',
      signInBtn: 'Sign In to Dashboard',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Sita Devi',
      emailOrMobileShort: 'Email or Mobile',
      mobilePlaceholder: 'Email or 10-digit mobile',
      passwordMin: 'Password (min 6 chars)',
      passwordCreatePlaceholder: 'Create password',
      village: 'Village / Town',
      villagePlaceholder: 'e.g. Sinnar',
      district: 'District',
      districtPlaceholder: 'e.g. Nashik',
      state: 'State',
      farmSize: 'Farm Size (Acres)',
      soilType: 'Soil Type',
      mainCrops: 'Main Crops',
      mainCropsPlaceholder: 'e.g. Paddy, Tomato',
      defaultMainCropsValue: 'Paddy, Wheat',
      creatingProfile: 'Creating Profile...',
      createAccountBtn: 'Create Farmer Account',
      demoBtn: 'Continue as Demo Farmer (Quick Preview)',
      storageNotice:
        'Farmer profiles and crop entries are saved on the built-in Node.js server (local file storage used as an alternative since cloud Firebase was skipped).',
      loginFallbackError: 'Unable to sign in right now.',
      registerFallbackError: 'Unable to create account right now.',
      demoFallbackError: 'Could not open demo farmer account.',
    },
    dashboard: {
      heroAlt: 'Green agricultural fields',
      greetingPrefix: 'Namaste',
      welcomeTitle: 'Welcome to your CropShield AI Farm Desk',
      welcomeSubtitle:
        'Manage your fields, check crop leaf photos with Gemini Vision, get seasonal crop suggestions, and connect with agricultural input suppliers.',
      scanLeafBtn: 'Scan Leaf Photo',
      askAiBtn: 'Ask Farming AI',
      loadError: 'Unable to load dashboard data.',
      saveCropError: 'Could not save crop.',
      deleteCropError: 'Could not delete crop.',
      cardAssistantTitle: 'AI Farming Assistant',
      cardAssistantDesc: 'Ask simple questions on soil health, organic farming, irrigation, and crop care.',
      cardDiseaseTitle: 'Disease Detection',
      cardDiseaseDesc: 'Upload crop leaf photos for visual symptom observations and preventive practices.',
      cardAdvisorTitle: 'Crop Recommendation',
      cardAdvisorDesc: 'Get tailored Kharif, Rabi, or Zaid crop ideas based on your soil and water.',
      cardMarketplaceTitle: 'Supplier Marketplace',
      cardMarketplaceDesc: 'Browse sample seeds, bio-fertilizers, drip kits, and contact regional suppliers.',
      farmerProfileTitle: 'Farmer Profile',
      editProfile: 'Edit Profile',
      farmerName: 'Farmer Name',
      location: 'Location',
      farmArea: 'Farm Area',
      acresUnit: 'acres',
      soilType: 'Soil Type',
      primaryCrops: 'Primary Crops',
      notListed: 'Not listed',
      demoFooterNote: 'Signed in with Demo Farmer Profile · You can customize details in Farmer Profile.',
      accountIdLabel: 'Account ID',
      weatherTitle: 'Regional Weather Overview',
      simulatedBadge: 'Simulated Sample Data · Not live satellite telemetry',
      selectWeatherStateAria: 'Select sample weather state',
      sampleSuffix: 'Sample',
      loadingWeather: 'Loading weather preset...',
      tempLabel: 'Temp',
      humidityLabel: 'Humidity',
      monthlyRainLabel: 'Monthly Rain',
      windLabel: 'Wind',
      fieldTipLabel: 'Field Tip',
      myCropsTitle: 'My Crop Information',
      myCropsSubtitle: 'Track active and planned seasonal crops across your farm plots.',
      addCropBtn: 'Add Crop',
      cancelBtn: 'Cancel',
      cropNameLabel: 'Crop Name',
      cropNamePlaceholder: 'e.g. Soybean, Onion, Cotton',
      varietyLabel: 'Variety (Optional)',
      varietyPlaceholder: 'e.g. JS-335',
      seasonLabel: 'Season',
      areaAcresLabel: 'Area (Acres)',
      growthStageLabel: 'Current Growth Stage',
      defaultGrowthStage: 'Vegetative Growth',
      growthStagePlaceholder: 'e.g. Sowing, Flowering',
      notesLabel: 'Notes',
      notesPlaceholder: 'Irrigation or fertilizer reminder',
      savingCropBtn: 'Saving...',
      saveCropBtn: 'Save Crop Record',
      noCropsYet: 'No crops tracked yet.',
      addFirstCropBtn: 'Add Your First Crop',
      removeCropAria: 'Remove',
      stageLabel: 'Stage',
      sampleCropNote: 'Sample starter crop · Edit or delete anytime',
      recentActivityTitle: 'Recent AI Checks & Inquiries',
      viewAllBtn: 'View All',
    },
    assistant: {
      title: 'AI Farming Assistant',
      subtitle: 'Ask beginner-friendly questions about crops, soil, organic care, irrigation, and Indian seasons.',
      shareContextLabel: 'Share my farm location & soil',
      newChatBtn: 'New Chat',
      starterQuestions: [
        'How can I improve soil health naturally before Kharif sowing?',
        'What is the best time and method to irrigate vegetables to prevent fungal spots?',
        'How do I make simple organic compost or vermicompost on my farm?',
        'My paddy leaves are turning slightly yellow at the tips. What questions should I check first?',
      ],
      welcomeMessage: (name) =>
        `Namaste ${name}! I am your CropShield AI Farming Assistant.\n\nYou can ask me about soil health, organic farming, irrigation, seasonal crop planning (Kharif, Rabi, Zaid), or general crop care in simple language.\n\nNote: I provide general educational guidance and will ask follow-up questions if details are missing. For major pesticide or treatment decisions, please always check with your local Krishi Vigyan Kendra (KVK) or agricultural officer.`,
      assistantBrand: 'CropShield AI',
      thinkingText: 'Thinking carefully about your farming question...',
      inputPlaceholder: 'Type your farming question in English, Telugu, or Hindi...',
      inputAria: 'Farming question',
      sendBtn: 'Send',
      advisoryFooter:
        'CropShield AI explains general agricultural concepts and asks clarifying questions when needed. Always consult your nearest Krishi Vigyan Kendra (KVK) or certified agronomist before applying chemical sprays or making major crop investments.',
      emptyResponseError: 'The farming assistant returned an empty response. Please try again.',
      signOutHint: 'Use Sign Out in the top-right to start a fresh session.',
      unexpectedErrorPrefix: 'Unexpected error',
      genericFallbackError: 'An unexpected error occurred while contacting the farming assistant.',
    },
    disease: {
      title: 'Crop Disease Image Analysis',
      subtitle: 'Upload a clear daylight photo of a crop leaf for AI visual symptom screening and general preventive care tips.',
      trySampleBtn: 'Try Sample Tomato Leaf',
      step1Title: '1. Upload Leaf Photograph',
      previewAlt: 'Uploaded crop leaf preview',
      changePhotoText: 'Click here to choose a different photo',
      selectPhotoTitle: 'Click to select a leaf photo',
      selectPhotoHint: 'JPG, PNG, or WebP up to 8 MB · Natural daylight works best',
      cropHintLabel: 'Crop Name (Optional — helps accuracy)',
      cropHintPlaceholder: 'e.g. Tomato, Paddy, Cotton, Wheat',
      notesLabel: 'Field Observations (Optional)',
      notesPlaceholder: 'e.g. Spotted on lower leaves after recent rain',
      analyzingBtn: 'Analyzing Leaf Image...',
      analyzeBtn: 'Analyze Leaf with Gemini AI',
      disclaimer: 'Disclaimer: Visual AI analysis is an educational screening aid, not a confirmed agricultural diagnosis.',
      step2Title: '2. Visual Screening Report',
      emptyTitle: 'Upload a leaf photograph or load the sample leaf to begin',
      emptyDesc:
        'Gemini will inspect visible spots, color changes, and leaf patterns, then share possible explanations, uncertainty notes, and safe preventive steps.',
      loadingDesc: 'Inspecting leaf texture, spots, and visible symptoms...',
      screeningBadgePrefix: 'Visual Screening Only (Not a Confirmed Diagnosis):',
      notLeafWarning:
        'This photo does not appear to clearly show a plant or crop leaf. Please upload a closer, well-lit leaf photograph.',
      possibleCropLabel: 'Possible Crop Identification',
      confidenceUncertaintyLabel: 'Visual Confidence & Uncertainty',
      confidencePrefix: 'Confidence',
      visibleSymptomsTitle: 'Visible Symptoms Observed',
      noSymptomsNote: 'No distinct disease spots clearly visible.',
      possibleConditionsTitle: 'Possible Disease or Stress Explanations',
      preventiveTitle: 'General Preventive & Field Care Practices',
      kvkFooter:
        'Bring a fresh leaf sample to your local Krishi Vigyan Kendra (KVK) before buying chemical treatments.',
      errInvalidFileType: 'Unsupported file type. Please upload a JPEG, PNG, or WebP photograph.',
      errMaxSize: 'Image is larger than 8 MB. Please choose a smaller photograph.',
      errReadFailed: 'Failed to read the image file.',
      errLoadSample: 'Unable to load the sample leaf photo. Please upload a photo from your device.',
      errNoImage: 'Please upload a crop leaf photograph first.',
      errFallback: 'Could not analyze this image right now. Please try again.',
    },
    advisor: {
      title: 'AI Crop Recommendation Advisor',
      subtitle: 'Enter your field conditions below to receive beginner-friendly crop options and explanations.',
      fillSampleBtn: 'Fill Sample Regional Data',
      formTitle: 'Field & Climate Inputs',
      simulatedBanner:
        'Sample / simulated regional values loaded for demonstration. Edit any field to match your real farm.',
      locationLabel: 'Location (District, State)',
      locationPlaceholder: 'e.g. Ludhiana, Punjab',
      sampleLocationValue: 'Nashik, Maharashtra (Sample)',
      soilTypeLabel: 'Soil Type',
      soilPhLabel: 'Soil pH (If known)',
      soilPhPlaceholder: 'e.g. 6.5 or leave blank',
      temperatureLabel: 'Typical Temperature (°C)',
      rainfallLabel: 'Monthly / Seasonal Rainfall (mm)',
      waterLabel: 'Water / Irrigation Availability',
      seasonLabel: 'Farming Season',
      generatingBtn: 'Generating Crop Suggestions...',
      submitBtn: 'Get Crop Recommendations',
      honestyNote:
        'CropShield AI uses only the details you enter above and does not invent live soil lab or weather readings.',
      emptyTitle: 'Your recommended crops will appear here',
      emptyDesc:
        'Submit your location, soil type, water availability, and season to see suitable crop options along with clear reasons why each fits.',
      loadingDesc: 'Matching crops to your soil, season, and water availability...',
      resultsSimulatedNote:
        'Note: These suggestions are based on the simulated sample regional climate inputs you loaded.',
      whySuitableTitle: 'Why this crop suits your inputs:',
      soilWaterNotesTitle: 'Soil & Water Notes',
      cautionTitle: 'Things to Watch',
      generalAdvisoryLabel: 'General Advisory:',
      missingContextLabel: 'Missing Context / Soil Testing:',
      errFallback: 'Unable to generate crop recommendations right now.',
    },
    marketplace: {
      title: 'Agricultural Supplier Marketplace',
      subtitle: 'Explore trusted-style sample suppliers for seeds, bio-fertilizers, organic crop care, and drip irrigation kits.',
      defaultNotice: 'Sample supplier directory for hackathon demonstration · No real payments enabled.',
      imageAlt: 'Sample organic neem fertilizer and crop seeds',
      searchPlaceholder: 'Search seeds, neem, drip kit...',
      searchAria: 'Search marketplace products',
      loadingText: 'Loading sample supplier listings...',
      noResults: 'No matching products found',
      resetFilters: 'Reset Filters',
      ownerPrefix: 'Owner',
      yearsActiveSuffix: 'yrs active',
      sampleListing: 'Sample Listing',
      specializationPrefix: 'Specialization',
      contactSupplierBtn: 'Contact Supplier',
      usageNotePrefix: 'Usage note:',
      contactModalTitlePrefix: 'Contact',
      sampleSupplierContact: 'Sample Supplier Contact',
      closeModalAria: 'Close modal',
      selectedProductPrefix: 'Selected Product:',
      indicativePricePrefix: 'Indicative ₹',
      inquiryRecordedTitle: 'Inquiry Recorded',
      yourInquiryLabel: 'Your Inquiry Message',
      cancelBtn: 'Cancel',
      sendingBtn: 'Sending...',
      sendInquiryBtn: 'Send Demo Inquiry',
      demoNoticeFooter: 'Hackathon Demonstration Notice: No online payments or real orders are processed in this prototype.',
      defaultProductInquiry: (owner, product, pack) =>
        `Hello ${owner}, I would like to know availability and delivery options for ${product} (${pack}).`,
      defaultSupplierInquiry: (owner) =>
        `Hello ${owner}, I would like to inquire about your agricultural products.`,
      errLoad: 'Unable to load suppliers.',
      errInquiry: 'Could not send inquiry.',
    },
    profile: {
      title: 'Farmer Profile Settings',
      errUpdate: 'Unable to update profile.',
      savedNotice: 'Profile updated and saved.',
      languagePreferenceLabel: 'Preferred Language',
      farmerNameLabel: 'Farmer Name',
      villageLabel: 'Village / Town',
      districtLabel: 'District',
      stateLabel: 'State',
      farmSizeLabel: 'Farm Size (Acres)',
      soilTypeLabel: 'Primary Soil Type',
      primaryCropsLabel: 'Primary Crops (comma separated)',
      savingBtn: 'Saving...',
      saveBtn: 'Save Profile Changes',
      historyTitle: 'Saved Check & Inquiry History',
      historyEmpty: 'No leaf checks, crop recommendations, or supplier inquiries recorded yet.',
      activityTypeLabel: {
        disease_check: 'Leaf Check',
        crop_recommendation: 'Crop Advisor',
        supplier_inquiry: 'Supplier Inquiry',
      },
    },
  },

  te: {
    brand: 'CropShield AI',
    tagline: 'తెలివైన వ్యవసాయం, ఆరోగ్యకరమైన పంటలు, మెరుగైన భవిష్యత్తు.',
    languageLabel: 'భాష',
    nav: {
      dashboard: 'డ్యాష్‌బోర్డ్',
      assistant: 'వ్యవసాయ సహాయకుడు',
      disease: 'తెగుళ్ల నిర్ధారణ',
      advisor: 'పంటల సలహాదారు',
      marketplace: 'విక్రేతల మార్కెట్',
      profile: 'రైతు ప్రొఫైల్',
      signOut: 'సైన్ అవుట్',
      openMenu: 'మెనూ తెరవండి',
      closeMenu: 'మెనూ మూసివేయండి',
      sidebarFooterTagline: 'తెలివైన వ్యవసాయం · ఆరోగ్యకరమైన పంటలు',
    },
    auth: {
      heroAlt: 'ఉదయపు ఎండలో పచ్చని భారతీయ వ్యవసాయ పొలాలు',
      heroTitle: 'తెలివైన వ్యవసాయం, ఆరోగ్యకరమైన పంటలు, మెరుగైన భవిష్యత్తు.',
      heroSubtitle:
        'భారతీయ రైతుల కోసం సులభమైన స్థానిక భాషా సహాయం, ఆకు ఫోటో ద్వారా తెగుళ్ల తనిఖీ, పంట సూచనలు మరియు స్థానిక వ్యవసాయ విక్రేతల సమాచారంతో రూపొందించబడింది.',
      heroBullet1: 'ఆకు ఫోటోలను అప్‌లోడ్ చేసి కనిపించే లక్షణాలు మరియు నివారణ పద్ధతులను తెలుసుకోండి',
      heroBullet2: 'అవసరమైన వివరాలు అడిగి, స్థానిక వ్యవసాయ అధికారుల సలహాను గౌరవించే నిజాయితీ గల AI సహాయం',
      heroFooter: 'CropShield AI · వ్యవసాయ నిర్ణయ సహాయ వేదిక',
      loginTitle: 'రైతు సైన్ ఇన్',
      registerTitle: 'రైతు నమోదు',
      loginSubtitle: 'మీ పొలం డ్యాష్‌బోర్డ్ మరియు AI పంట సేవలను ఉపయోగించండి.',
      registerSubtitle: 'ఒక్క నిమిషంలోపే మీ పొలం ప్రొఫైల్‌ను రూపొందించండి.',
      tabSignIn: 'సైన్ ఇన్',
      tabRegister: 'నమోదు చేసుకోండి',
      emailOrMobile: 'ఇమెయిల్ లేదా మొబైల్ నంబర్',
      emailOrMobilePlaceholder: 'ఉదా. ramesh@farm.in లేదా 9876543210',
      password: 'పాస్‌వర్డ్',
      passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
      signingIn: 'సైన్ ఇన్ అవుతోంది...',
      signInBtn: 'డ్యాష్‌బోర్డ్‌లోకి వెళ్లండి',
      fullName: 'పూర్తి పేరు',
      fullNamePlaceholder: 'ఉదా. సీతా దేవి',
      emailOrMobileShort: 'ఇమెయిల్ లేదా మొబైల్',
      mobilePlaceholder: 'ఇమెయిల్ లేదా 10 అంకెల మొబైల్',
      passwordMin: 'పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)',
      passwordCreatePlaceholder: 'పాస్‌వర్డ్ సృష్టించండి',
      village: 'గ్రామం / పట్టణం',
      villagePlaceholder: 'ఉదా. గుంటూరు గ్రామం',
      district: 'జిల్లా',
      districtPlaceholder: 'ఉదా. నాసిక్ / గుంటూరు',
      state: 'రాష్ట్రం',
      farmSize: 'పొలం విస్తీర్ణం (ఎకరాలు)',
      soilType: 'నేల రకం',
      mainCrops: 'ప్రధాన పంటలు',
      mainCropsPlaceholder: 'ఉదా. వరి, టమోటా',
      defaultMainCropsValue: 'వరి, గోధుమ',
      creatingProfile: 'ప్రొఫైల్ సృష్టిస్తోంది...',
      createAccountBtn: 'రైతు ఖాతా సృష్టించండి',
      demoBtn: 'డెమో రైతుగా కొనసాగండి (త్వరిత వీక్షణ)',
      storageNotice:
        'రైతు ప్రొఫైల్స్ మరియు పంటల వివరాలు అంతర్నిర్మిత Node.js సర్వర్‌లో సేవ్ చేయబడతాయి (క్లౌడ్ Firebase ఎంపిక చేయనందున లోకల్ ఫైల్ నిల్వ ఉపయోగించబడింది).',
      loginFallbackError: 'ప్రస్తుతం సైన్ ఇన్ చేయడం సాధ్యం కాలేదు.',
      registerFallbackError: 'ప్రస్తుతం ఖాతా సృష్టించడం సాధ్యం కాలేదు.',
      demoFallbackError: 'డెమో రైతు ఖాతాను తెరవడం సాధ్యం కాలేదు.',
    },
    dashboard: {
      heroAlt: 'పచ్చని వ్యవసాయ పొలాలు',
      greetingPrefix: 'నమస్కారం',
      welcomeTitle: 'మీ CropShield AI వ్యవసాయ వేదికకు స్వాగతం',
      welcomeSubtitle:
        'మీ పొలాల వివరాలను నిర్వహించండి, Gemini Vision తో ఆకు ఫోటోలను తనిఖీ చేయండి, సీజన్ వారీ పంట సూచనలు పొందండి మరియు స్థానిక విక్రేతలను సంప్రదించండి.',
      scanLeafBtn: 'ఆకు ఫోటో తనిఖీ',
      askAiBtn: 'వ్యవసాయ AI ని అడగండి',
      loadError: 'డ్యాష్‌బోర్డ్ వివరాలు లోడ్ చేయడం సాధ్యం కాలేదు.',
      saveCropError: 'పంట వివరాలను సేవ్ చేయడం సాధ్యం కాలేదు.',
      deleteCropError: 'పంట వివరాలను తొలగించడం సాధ్యం కాలేదు.',
      cardAssistantTitle: 'AI వ్యవసాయ సహాయకుడు',
      cardAssistantDesc: 'నేల ఆరోగ్యం, సేంద్రియ వ్యవసాయం, నీటిపారుదల మరియు పంట సంరక్షణపై సులభంగా ప్రశ్నలు అడగండి.',
      cardDiseaseTitle: 'తెగుళ్ల నిర్ధారణ',
      cardDiseaseDesc: 'ఆకు ఫోటోను అప్‌లోడ్ చేసి కనిపించే లక్షణాలు మరియు నివారణ జాగ్రత్తలు తెలుసుకోండి.',
      cardAdvisorTitle: 'పంటల సలహాదారు',
      cardAdvisorDesc: 'మీ నేల మరియు నీటి వసతికి అనుగుణంగా ఖరీఫ్, రబీ లేదా జైద్ పంట సూచనలు పొందండి.',
      cardMarketplaceTitle: 'విక్రేతల మార్కెట్',
      cardMarketplaceDesc: 'విత్తనాలు, జీవ ఎరువులు, డ్రిప్ కిట్ల నమూనా జాబితాను చూసి విక్రేతలను సంప్రదించండి.',
      farmerProfileTitle: 'రైతు ప్రొఫైల్',
      editProfile: 'ప్రొఫైల్ మార్చండి',
      farmerName: 'రైతు పేరు',
      location: 'ప్రాంతం',
      farmArea: 'పొలం విస్తీర్ణం',
      acresUnit: 'ఎకరాలు',
      soilType: 'నేల రకం',
      primaryCrops: 'ప్రధాన పంటలు',
      notListed: 'నమోదు చేయలేదు',
      demoFooterNote: 'డెమో రైతు ప్రొఫైల్‌తో సైన్ ఇన్ అయ్యారు · రైతు ప్రొఫైల్‌లో వివరాలను మార్చుకోవచ్చు.',
      accountIdLabel: 'ఖాతా ID',
      weatherTitle: 'ప్రాంతీయ వాతావరణ సమాచారం',
      simulatedBadge: 'నమూనా వాతావరణ డేటా · ఇది ప్రత్యక్ష శాటిలైట్ సమాచారం కాదు',
      selectWeatherStateAria: 'నమూనా వాతావరణ రాష్ట్రాన్ని ఎంచుకోండి',
      sampleSuffix: 'నమూనా',
      loadingWeather: 'వాతావరణ వివరాలు లోడ్ అవుతున్నాయి...',
      tempLabel: 'ఉష్ణోగ్రత',
      humidityLabel: 'తేమ',
      monthlyRainLabel: 'నెలవారీ వర్షం',
      windLabel: 'గాలి వేగం',
      fieldTipLabel: 'పొలం సూచన',
      myCropsTitle: 'నా పంటల సమాచారం',
      myCropsSubtitle: 'మీ పొలాల్లో సాగులో ఉన్న మరియు ప్రణాళిక చేసిన పంటలను ట్రాక్ చేయండి.',
      addCropBtn: 'పంట జోడించండి',
      cancelBtn: 'రద్దు చేయండి',
      cropNameLabel: 'పంట పేరు',
      cropNamePlaceholder: 'ఉదా. సోయాబీన్, ఉల్లి, పత్తి',
      varietyLabel: 'రకం (ఐచ్ఛికం)',
      varietyPlaceholder: 'ఉదా. JS-335 / సాంబ మసూరి',
      seasonLabel: 'పంట కాలం',
      areaAcresLabel: 'విస్తీర్ణం (ఎకరాలు)',
      growthStageLabel: 'ప్రస్తుత పెరుగుదల దశ',
      defaultGrowthStage: 'మొక్క పెరుగుదల దశ',
      growthStagePlaceholder: 'ఉదా. విత్తడం, పూత దశ',
      notesLabel: 'గమనికలు',
      notesPlaceholder: 'నీరు పెట్టడం లేదా ఎరువుల గుర్తు',
      savingCropBtn: 'సేవ్ అవుతోంది...',
      saveCropBtn: 'పంట వివరాన్ని సేవ్ చేయండి',
      noCropsYet: 'ఇంకా ఏ పంటలు నమోదు చేయలేదు.',
      addFirstCropBtn: 'మీ మొదటి పంటను జోడించండి',
      removeCropAria: 'తొలగించు',
      stageLabel: 'దశ',
      sampleCropNote: 'నమూనా పంట · ఎప్పుడైనా మార్చవచ్చు లేదా తొలగించవచ్చు',
      recentActivityTitle: 'ఇటీవలి AI తనిఖీలు & విచారణలు',
      viewAllBtn: 'అన్నీ చూడండి',
    },
    assistant: {
      title: 'AI వ్యవసాయ సహాయకుడు',
      subtitle: 'పంటలు, నేల ఆరోగ్యం, సేంద్రియ పద్ధతులు, నీటిపారుదల మరియు సీజన్లపై సులభమైన భాషలో ప్రశ్నలు అడగండి.',
      shareContextLabel: 'నా పొలం ప్రాంతం & నేల వివరాలను పంచుకోండి',
      newChatBtn: 'కొత్త చాట్',
      starterQuestions: [
        'ఖరీఫ్ విత్తనానికి ముందు సహజంగా నేల బలాన్ని ఎలా పెంచుకోవచ్చు?',
        'కూరగాయల ఆకులపై ఫంగస్ మచ్చలు రాకుండా ఏ సమయంలో, ఎలా నీరు పెట్టాలి?',
        'నా పొలంలోనే సులభంగా సేంద్రియ కంపోస్ట్ లేదా వర్మీకంపోస్ట్ ఎలా తయారు చేయాలి?',
        'నా వరి ఆకుల చివర్లు కొద్దిగా పసుపు రంగులోకి మారుతున్నాయి. ముందుగా ఏ విషయాలు తనిఖీ చేయాలి?',
      ],
      welcomeMessage: (name) =>
        `నమస్కారం ${name} గారు! నేను మీ CropShield AI వ్యవసాయ సహాయకుడిని.\n\nమీరు నేల ఆరోగ్యం, సేంద్రియ వ్యవసాయం, నీటిపారుదల, పంట కాలాల ప్రణాళిక (ఖరీఫ్, రబీ, జైద్) లేదా సాధారణ పంట సంరక్షణ గురించి సులభమైన తెలుగులో అడగవచ్చు.\n\nగమనిక: నేను సాధారణ వ్యవసాయ అవగాహన కోసం సమాచారం అందిస్తాను మరియు వివరాలు తక్కువగా ఉంటే స్పష్టత కోసం ప్రశ్నలు అడుగుతాను. ముఖ్యమైన పురుగుమందులు లేదా చికిత్స నిర్ణయాల కోసం దయచేసి ఎల్లప్పుడూ మీ సమీప కృషి విజ్ఞాన కేంద్రం (KVK) లేదా వ్యవసాయ అధికారిని సంప్రదించండి.`,
      assistantBrand: 'CropShield AI',
      thinkingText: 'మీ వ్యవసాయ ప్రశ్నకు సమాధానం ఆలోచిస్తోంది...',
      inputPlaceholder: 'తెలుగు, హిందీ లేదా ఆంగ్లంలో మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి...',
      inputAria: 'వ్యవసాయ ప్రశ్న',
      sendBtn: 'పంపండి',
      advisoryFooter:
        'CropShield AI సాధారణ వ్యవసాయ విషయాలను వివరిస్తుంది మరియు అవసరమైనప్పుడు అదనపు వివరాలు అడుగుతుంది. రసాయన మందులు చల్లే ముందు లేదా పెద్ద పెట్టుబడులు పెట్టే ముందు మీ సమీప కృషి విజ్ఞాన కేంద్రం (KVK) లేదా వ్యవసాయ నిపుణులను సంప్రదించండి.',
      emptyResponseError: 'వ్యవసాయ సహాయకుడు ఖాళీ సమాధానం పంపారు. దయచేసి మళ్లీ ప్రయత్నించండి.',
      signOutHint: 'కొత్త సెషన్ ప్రారంభించడానికి పైభాగంలో ఉన్న సైన్ అవుట్ బటన్ నొక్కండి.',
      unexpectedErrorPrefix: 'అనుకోని లోపం',
      genericFallbackError: 'వ్యవసాయ సహాయకుడిని సంప్రదించడంలో అనుకోని లోపం జరిగింది.',
    },
    disease: {
      title: 'పంట ఆకు వ్యాధి ఫోటో విశ్లేషణ',
      subtitle: 'ఆకుపై కనిపించే లక్షణాలను మరియు సాధారణ నివారణ జాగ్రత్తలను తెలుసుకోవడానికి పగటి వెలుతురులో తీసిన స్పష్టమైన ఆకు ఫోటోను అప్‌లోడ్ చేయండి.',
      trySampleBtn: 'నమూనా టమోటా ఆకును ప్రయత్నించండి',
      step1Title: '1. ఆకు ఫోటోను అప్‌లోడ్ చేయండి',
      previewAlt: 'అప్‌లోడ్ చేసిన పంట ఆకు ఫోటో',
      changePhotoText: 'వేరే ఫోటో ఎంచుకోవడానికి ఇక్కడ క్లిక్ చేయండి',
      selectPhotoTitle: 'ఆకు ఫోటోను ఎంచుకోవడానికి క్లిక్ చేయండి',
      selectPhotoHint: '8 MB లోపు JPG, PNG లేదా WebP · పగటి వెలుతురులో తీసిన ఫోటో ఉత్తమం',
      cropHintLabel: 'పంట పేరు (ఐచ్ఛికం — మరింత ఖచ్చితత్వానికి సహాయపడుతుంది)',
      cropHintPlaceholder: 'ఉదా. టమోటా, వరి, పత్తి, మిరప',
      notesLabel: 'పొలంలో గమనించిన వివరాలు (ఐచ్ఛికం)',
      notesPlaceholder: 'ఉదా. ఇటీవల వర్షం పడిన తర్వాత కింది ఆకులపై మచ్చలు వచ్చాయి',
      analyzingBtn: 'ఆకు ఫోటోను పరిశీలిస్తోంది...',
      analyzeBtn: 'Gemini AI తో ఆకును తనిఖీ చేయండి',
      disclaimer:
        'గమనిక: ఫోటో ద్వారా చేసే AI తనిఖీ కేవలం ప్రాథమిక అవగాహన కోసం మాత్రమే, ఇది ఖచ్చితమైన ప్రయోగశాల వ్యాధి నిర్ధారణ కాదు.',
      step2Title: '2. దృశ్య తనిఖీ నివేదిక',
      emptyTitle: 'ప్రారంభించడానికి ఆకు ఫోటోను అప్‌లోడ్ చేయండి లేదా నమూనా ఆకును లోడ్ చేయండి',
      emptyDesc:
        'ఆకుపై ఉన్న మచ్చలు, రంగు మార్పులు మరియు నమూనాలను Gemini పరిశీలించి సాధ్యమైన కారణాలు, అనిశ్చితి గమనికలు మరియు సురక్షిత నివారణ పద్ధతులను వివరిస్తుంది.',
      loadingDesc: 'ఆకు ఉపరితలం, మచ్చలు మరియు కనిపించే లక్షణాలను పరిశీలిస్తోంది...',
      screeningBadgePrefix: 'ప్రాథమిక దృశ్య తనిఖీ మాత్రమే (ఖచ్చితమైన నిర్ధారణ కాదు):',
      notLeafWarning:
        'ఈ ఫోటోలో పంట లేదా మొక్క ఆకు స్పష్టంగా కనిపించడం లేదు. దయచేసి మంచి వెలుతురులో దగ్గరగా తీసిన ఆకు ఫోటోను అప్‌లోడ్ చేయండి.',
      possibleCropLabel: 'అంచనా వేసిన పంట పేరు',
      confidenceUncertaintyLabel: 'దృశ్య నమ్మకం & అనిశ్చితి వివరాలు',
      confidencePrefix: 'నమ్మక స్థాయి',
      visibleSymptomsTitle: 'ఫోటోలో కనిపిస్తున్న లక్షణాలు',
      noSymptomsNote: 'స్పష్టమైన తెగులు మచ్చలు ఏవీ కనిపించలేదు.',
      possibleConditionsTitle: 'సాధ్యమైన తెగుళ్లు లేదా పోషక లోప కారణాలు',
      preventiveTitle: 'సాధారణ నివారణ & పొలం సంరక్షణ పద్ధతులు',
      kvkFooter:
        'రసాయన మందులు కొనుగోలు చేసే ముందు తాజా ఆకు నమూనాను మీ సమీప కృషి విజ్ఞాన కేంద్రం (KVK) వద్ద చూపించండి.',
      errInvalidFileType: 'మద్దతు లేని ఫైల్ రకం. దయచేసి JPEG, PNG లేదా WebP ఫోటోను అప్‌లోడ్ చేయండి.',
      errMaxSize: 'ఫోటో 8 MB కంటే పెద్దదిగా ఉంది. దయచేసి చిన్న ఫోటోను ఎంచుకోండి.',
      errReadFailed: 'ఫోటో ఫైల్‌ను చదవడంలో లోపం జరిగింది.',
      errLoadSample: 'నమూనా ఆకు ఫోటోను లోడ్ చేయడం సాధ్యం కాలేదు. దయచేసి మీ ఫోన్ నుండి ఫోటో అప్‌లోడ్ చేయండి.',
      errNoImage: 'దయచేసి ముందుగా పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి.',
      errFallback: 'ప్రస్తుతం ఈ ఫోటోను విశ్లేషించలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.',
    },
    advisor: {
      title: 'AI పంటల సిఫార్సు సలహాదారు',
      subtitle: 'మీ పొలం పరిస్థితులను నమోదు చేసి, సరైన పంట ఎంపికలు మరియు సులభమైన కారణాలను తెలుసుకోండి.',
      fillSampleBtn: 'నమూనా ప్రాంతీయ డేటాను నింపండి',
      formTitle: 'పొలం & వాతావరణ వివరాలు',
      simulatedBanner:
        'ప్రదర్శన కోసం నమూనా ప్రాంతీయ విలువలు లోడ్ చేయబడ్డాయి. మీ అసలు పొలం వివరాలకు అనుగుణంగా మార్చుకోవచ్చు.',
      locationLabel: 'ప్రాంతం (జిల్లా, రాష్ట్రం)',
      locationPlaceholder: 'ఉదా. గుంటూరు, ఆంధ్ర ప్రదేశ్',
      sampleLocationValue: 'నాసిక్, మహారాష్ట్ర (నమూనా)',
      soilTypeLabel: 'నేల రకం',
      soilPhLabel: 'నేల pH విలువ (తెలిస్తే)',
      soilPhPlaceholder: 'ఉదా. 6.5 లేదా ఖాళీగా వదిలేయండి',
      temperatureLabel: 'సాధారణ ఉష్ణోగ్రత (°C)',
      rainfallLabel: 'నెలవారీ / సీజన్ వర్షపాతం (mm)',
      waterLabel: 'నీరు / నీటిపారుదల లభ్యత',
      seasonLabel: 'వ్యవసాయ కాలం',
      generatingBtn: 'పంట సూచనలు సిద్ధమవుతున్నాయి...',
      submitBtn: 'పంట సిఫార్సులు పొందండి',
      honestyNote:
        'CropShield AI మీరు నమోదు చేసిన వివరాల ఆధారంగానే సూచనలు ఇస్తుంది; కృత్రిమ లైవ్ వాతావరణ లేదా ల్యాబ్ నేల పరీక్ష విలువలను సృష్టించదు.',
      emptyTitle: 'మీకు అనువైన పంటల సూచనలు ఇక్కడ కనిపిస్తాయి',
      emptyDesc:
        'మీ ప్రాంతం, నేల రకం, నీటి వసతి మరియు పంట కాలాన్ని పంపించి, ప్రతి పంట ఎందుకు సరిపోతుందో కారణాలతో సహా తెలుసుకోండి.',
      loadingDesc: 'మీ నేల, సీజన్ మరియు నీటి వసతికి సరిపోయే పంటలను వెతుకుతోంది...',
      resultsSimulatedNote: 'గమనిక: ఈ సూచనలు మీరు లోడ్ చేసిన నమూనా ప్రాంతీయ వాతావరణ వివరాల ఆధారంగా ఇవ్వబడ్డాయి.',
      whySuitableTitle: 'ఈ పంట మీ పొలానికి ఎందుకు అనుకూలం:',
      soilWaterNotesTitle: 'నేల & నీటి సూచనలు',
      cautionTitle: 'జాగ్రత్త వహించాల్సిన విషయాలు',
      generalAdvisoryLabel: 'సాధారణ సలహా:',
      missingContextLabel: 'తెలియని వివరాలు / నేల పరీక్ష:',
      errFallback: 'ప్రస్తుతం పంట సిఫార్సులను రూపొందించడం సాధ్యం కాలేదు.',
    },
    marketplace: {
      title: 'వ్యవసాయ ఇన్‌పుట్ విక్రేతల మార్కెట్',
      subtitle: 'విత్తనాలు, జీవ ఎరువులు, సేంద్రియ పంట సంరక్షణ మరియు డ్రిప్ పరికరాల నమూనా విక్రేతలను చూడండి.',
      defaultNotice: 'హ్యాకథాన్ ప్రదర్శన కోసం నమూనా విక్రేతల జాబితా · అసలు చెల్లింపులు లేవు.',
      imageAlt: 'నమూనా సేంద్రియ వేప ఎరువు మరియు పంట విత్తనాలు',
      searchPlaceholder: 'విత్తనాలు, వేప, డ్రిప్ కిట్ వెతకండి...',
      searchAria: 'మార్కెట్ ఉత్పత్తులను వెతకండి',
      loadingText: 'నమూనా విక్రేతల జాబితా లోడ్ అవుతోంది...',
      noResults: 'సరిపోయే ఉత్పత్తులు కనుగొనబడలేదు',
      resetFilters: 'ఫిల్టర్లు రీసెట్ చేయండి',
      ownerPrefix: 'యజమాని',
      yearsActiveSuffix: 'సం. అనుభవం',
      sampleListing: 'నమూనా జాబితా',
      specializationPrefix: 'ప్రత్యేకత',
      contactSupplierBtn: 'విక్రేతను సంప్రదించండి',
      usageNotePrefix: 'వాడుక సూచన:',
      contactModalTitlePrefix: 'సంప్రదించండి:',
      sampleSupplierContact: 'నమూనా విక్రేత సంప్రదింపు వివరాలు',
      closeModalAria: 'మోడల్ మూసివేయండి',
      selectedProductPrefix: 'ఎంచుకున్న ఉత్పత్తి:',
      indicativePricePrefix: 'సుమారు ధర ₹',
      inquiryRecordedTitle: 'విచారణ నమోదైంది',
      yourInquiryLabel: 'మీ విచారణ సందేశం',
      cancelBtn: 'రద్దు చేయండి',
      sendingBtn: 'పంపుతోంది...',
      sendInquiryBtn: 'నమూనా విచారణ పంపండి',
      demoNoticeFooter: 'హ్యాకథాన్ ప్రదర్శన గమనిక: ఈ నమూనాలో ఆన్‌లైన్ చెల్లింపులు లేదా అసలు ఆర్డర్లు జరగవు.',
      defaultProductInquiry: (owner, product, pack) =>
        `నమస్కారం ${owner} గారు, ${product} (${pack}) లభ్యత మరియు డెలివరీ వివరాల గురించి తెలుసుకోవాలనుకుంటున్నాను.`,
      defaultSupplierInquiry: (owner) =>
        `నమస్కారం ${owner} గారు, మీ వ్యవసాయ ఉత్పత్తుల గురించి వివరాలు తెలుసుకోవాలనుకుంటున్నాను.`,
      errLoad: 'విక్రేతల వివరాలను లోడ్ చేయడం సాధ్యం కాలేదు.',
      errInquiry: 'విచారణ సందేశాన్ని పంపడం సాధ్యం కాలేదు.',
    },
    profile: {
      title: 'రైతు ప్రొఫైల్ సెట్టింగ్‌లు',
      errUpdate: 'ప్రొఫైల్‌ను అప్‌డేట్ చేయడం సాధ్యం కాలేదు.',
      savedNotice: 'ప్రొఫైల్ వివరాలు సేవ్ చేయబడ్డాయి.',
      languagePreferenceLabel: 'యాప్ భాష',
      farmerNameLabel: 'రైతు పేరు',
      villageLabel: 'గ్రామం / పట్టణం',
      districtLabel: 'జిల్లా',
      stateLabel: 'రాష్ట్రం',
      farmSizeLabel: 'పొలం విస్తీర్ణం (ఎకరాలు)',
      soilTypeLabel: 'ప్రధాన నేల రకం',
      primaryCropsLabel: 'ప్రధాన పంటలు (కామాతో వేరు చేసి రాయండి)',
      savingBtn: 'సేవ్ అవుతోంది...',
      saveBtn: 'ప్రొఫైల్ మార్పులు సేవ్ చేయండి',
      historyTitle: 'సేవ్ చేసిన తనిఖీలు & విచారణ చరిత్ర',
      historyEmpty: 'ఇంకా ఆకు తనిఖీలు, పంట సిఫార్సులు లేదా విక్రేత విచారణలు నమోదు కాలేదు.',
      activityTypeLabel: {
        disease_check: 'ఆకు తనిఖీ',
        crop_recommendation: 'పంట సలహా',
        supplier_inquiry: 'విక్రేత విచారణ',
      },
    },
  },

  hi: {
    brand: 'CropShield AI',
    tagline: 'स्मार्ट खेती, स्वस्थ फसलें, बेहतर भविष्य।',
    languageLabel: 'भाषा',
    nav: {
      dashboard: 'डैशबोर्ड',
      assistant: 'कृषि सहायक',
      disease: 'रोग पहचान',
      advisor: 'फसल सलाहकार',
      marketplace: 'विक्रेता बाज़ार',
      profile: 'किसान प्रोफ़ाइल',
      signOut: 'साइन आउट',
      openMenu: 'मेनू खोलें',
      closeMenu: 'मेनू बंद करें',
      sidebarFooterTagline: 'स्मार्ट खेती · स्वस्थ फसलें',
    },
    auth: {
      heroAlt: 'सुबह की धूप में हरे-भरे भारतीय खेत',
      heroTitle: 'स्मार्ट खेती, स्वस्थ फसलें, बेहतर भविष्य।',
      heroSubtitle:
        'भारतीय किसानों के लिए सरल बहुभाषी सलाह, पत्तियों की तस्वीर से रोग जांच, मौसम के अनुसार फसल सुझाव और स्थानीय कृषि विक्रेताओं की जानकारी के साथ तैयार।',
      heroBullet1: 'पत्ती की तस्वीर अपलोड करें और AI द्वारा लक्षण व बचाव के उपाय जानें',
      heroBullet2: 'सही जानकारी के लिए सवाल पूछने और स्थानीय कृषि विशेषज्ञों का सम्मान करने वाली विश्वसनीय AI सहायता',
      heroFooter: 'CropShield AI · कृषि निर्णय सहायता मंच',
      loginTitle: 'किसान साइन इन',
      registerTitle: 'किसान पंजीकरण',
      loginSubtitle: 'अपने खेत का डैशबोर्ड और AI फसल उपकरण खोलें।',
      registerSubtitle: 'एक मिनट से भी कम समय में अपनी खेती प्रोफ़ाइल बनाएं।',
      tabSignIn: 'साइन इन',
      tabRegister: 'पंजीकरण करें',
      emailOrMobile: 'ईमेल या मोबाइल नंबर',
      emailOrMobilePlaceholder: 'जैसे ramesh@farm.in या 9876543210',
      password: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      signingIn: 'साइन इन हो रहा है...',
      signInBtn: 'डैशबोर्ड में प्रवेश करें',
      fullName: 'पूरा नाम',
      fullNamePlaceholder: 'जैसे सीता देवी',
      emailOrMobileShort: 'ईमेल या मोबाइल',
      mobilePlaceholder: 'ईमेल या 10 अंकों का मोबाइल',
      passwordMin: 'पासवर्ड (कम से कम 6 अक्षर)',
      passwordCreatePlaceholder: 'पासवर्ड बनाएं',
      village: 'गाँव / कस्बा',
      villagePlaceholder: 'जैसे सिन्नर',
      district: 'जिला',
      districtPlaceholder: 'जैसे नासिक',
      state: 'राज्य',
      farmSize: 'खेत का क्षेत्रफल (एकड़)',
      soilType: 'मिट्टी का प्रकार',
      mainCrops: 'मुख्य फसलें',
      mainCropsPlaceholder: 'जैसे धान, टमाटर',
      defaultMainCropsValue: 'धान, गेहूं',
      creatingProfile: 'प्रोफ़ाइल बन रही है...',
      createAccountBtn: 'किसान खाता बनाएं',
      demoBtn: 'डेमो किसान के रूप में जारी रखें (त्वरित दर्शन)',
      storageNotice:
        'किसान प्रोफ़ाइल और फसलों का विवरण बिल्ट-इन Node.js सर्वर में सहेजा जाता है (क्लाउड Firebase न चुनने के कारण स्थानीय फाइल स्टोरेज उपयोग किया गया है)।',
      loginFallbackError: 'अभी साइन इन नहीं हो सका।',
      registerFallbackError: 'अभी खाता नहीं बनाया जा सका।',
      demoFallbackError: 'डेमो किसान खाता नहीं खुल सका।',
    },
    dashboard: {
      heroAlt: 'हरे-भरे कृषि खेत',
      greetingPrefix: 'नमस्ते',
      welcomeTitle: 'आपके CropShield AI कृषि केंद्र में स्वागत है',
      welcomeSubtitle:
        'अपने खेतों का प्रबंधन करें, Gemini Vision से फसल की पत्तियों की जांच करें, मौसम के अनुसार फसल सुझाव पाएं और कृषि विक्रेताओं से जुड़ें।',
      scanLeafBtn: 'पत्ती की तस्वीर जांचें',
      askAiBtn: 'कृषि AI से पूछें',
      loadError: 'डैशबोर्ड डेटा लोड नहीं हो सका।',
      saveCropError: 'फसल रिकॉर्ड सहेजा नहीं जा सका।',
      deleteCropError: 'फसल रिकॉर्ड हटाया नहीं जा सका।',
      cardAssistantTitle: 'AI कृषि सहायक',
      cardAssistantDesc: 'मिट्टी के स्वास्थ्य, जैविक खेती, सिंचाई और फसल देखभाल पर सरल सवाल पूछें।',
      cardDiseaseTitle: 'रोग पहचान',
      cardDiseaseDesc: 'फसल के पत्ते की तस्वीर अपलोड करके लक्षण और बचाव के तरीके देखें।',
      cardAdvisorTitle: 'फसल सुझाव',
      cardAdvisorDesc: 'अपनी मिट्टी और पानी की सुविधा के अनुसार खरीफ, रबी या जायद फसलों के सुझाव पाएं।',
      cardMarketplaceTitle: 'विक्रेता बाज़ार',
      cardMarketplaceDesc: 'बीज, जैव-उर्वरक और ड्रिप किट के नमूना विक्रेता देखें और संपर्क करें।',
      farmerProfileTitle: 'किसान प्रोफ़ाइल',
      editProfile: 'प्रोफ़ाइल बदलें',
      farmerName: 'किसान का नाम',
      location: 'स्थान',
      farmArea: 'खेत का क्षेत्रफल',
      acresUnit: 'एकड़',
      soilType: 'मिट्टी का प्रकार',
      primaryCrops: 'मुख्य फसलें',
      notListed: 'दर्ज नहीं है',
      demoFooterNote: 'डेमो किसान प्रोफ़ाइल से साइन इन हैं · आप किसान प्रोफ़ाइल में विवरण बदल सकते हैं।',
      accountIdLabel: 'खाता ID',
      weatherTitle: 'क्षेत्रीय मौसम अवलोकन',
      simulatedBadge: 'नमूना मौसम डेटा · यह लाइव सैटेलाइट जानकारी नहीं है',
      selectWeatherStateAria: 'नमूना मौसम राज्य चुनें',
      sampleSuffix: 'नमूना',
      loadingWeather: 'मौसम जानकारी लोड हो रही है...',
      tempLabel: 'तापमान',
      humidityLabel: 'नमी',
      monthlyRainLabel: 'मासिक वर्षा',
      windLabel: 'हवा',
      fieldTipLabel: 'खेत की सलाह',
      myCropsTitle: 'मेरी फसलों की जानकारी',
      myCropsSubtitle: 'अपने खेतों में उगाई जा रही और प्रस्तावित फसलों का रिकॉर्ड रखें।',
      addCropBtn: 'फसल जोड़ें',
      cancelBtn: 'रद्द करें',
      cropNameLabel: 'फसल का नाम',
      cropNamePlaceholder: 'जैसे सोयाबीन, प्याज, कपास',
      varietyLabel: 'किस्म (वैकल्पिक)',
      varietyPlaceholder: 'जैसे JS-335',
      seasonLabel: 'मौसम / सीजन',
      areaAcresLabel: 'क्षेत्रफल (एकड़)',
      growthStageLabel: 'वर्तमान वृद्धि अवस्था',
      defaultGrowthStage: 'वानस्पतिक वृद्धि',
      growthStagePlaceholder: 'जैसे बुवाई, फूल आना',
      notesLabel: 'टिप्पणी',
      notesPlaceholder: 'सिंचाई या खाद का रिमाइंडर',
      savingCropBtn: 'सहेजा जा रहा है...',
      saveCropBtn: 'फसल रिकॉर्ड सहेजें',
      noCropsYet: 'अभी कोई फसल दर्ज नहीं है।',
      addFirstCropBtn: 'अपनी पहली फसल जोड़ें',
      removeCropAria: 'हटाएं',
      stageLabel: 'अवस्था',
      sampleCropNote: 'नमूना फसल · कभी भी बदलें या हटाएं',
      recentActivityTitle: 'हाल की AI जांच और पूछताछ',
      viewAllBtn: 'सभी देखें',
    },
    assistant: {
      title: 'AI कृषि सहायक',
      subtitle: 'फसलों, मिट्टी, जैविक देखभाल, सिंचाई और भारतीय खेती के मौसमों के बारे में सरल भाषा में सवाल पूछें।',
      shareContextLabel: 'मेरे खेत का स्थान और मिट्टी की जानकारी साझा करें',
      newChatBtn: 'नई चैट',
      starterQuestions: [
        'खरीफ की बुवाई से पहले मिट्टी की उर्वरता प्राकृतिक तरीके से कैसे बढ़ाएं?',
        'सब्जियों में फफूंद के धब्बे रोकने के लिए सिंचाई का सही समय और तरीका क्या है?',
        'मैं अपने खेत में सरल जैविक खाद या वर्मीकम्पोस्ट कैसे तैयार कर सकता हूँ?',
        'मेरे धान की पत्तियों के सिरे हल्के पीले पड़ रहे हैं। मुझे पहले क्या जांचना चाहिए?',
      ],
      welcomeMessage: (name) =>
        `नमस्ते ${name} जी! मैं आपका CropShield AI कृषि सहायक हूँ।\n\nआप मुझसे मिट्टी की सेहत, जैविक खेती, सिंचाई, मौसमी फसल योजना (खरीफ, रबी, जायद) या फसल देखभाल के बारे में सरल हिन्दी में सवाल पूछ सकते हैं।\n\nध्यान दें: मैं सामान्य शैक्षिक मार्गदर्शन देता हूँ और जानकारी अधूरी होने पर स्पष्ट करने के लिए सवाल पूछता हूँ। किसी भी बड़े कीटनाशक या उपचार से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से सलाह जरूर लें।`,
      assistantBrand: 'CropShield AI',
      thinkingText: 'आपके खेती से जुड़े सवाल पर विचार किया जा रहा है...',
      inputPlaceholder: 'अपना कृषि प्रश्न हिन्दी, तेलुगु या अंग्रेजी में लिखें...',
      inputAria: 'खेती से जुड़ा प्रश्न',
      sendBtn: 'भेजें',
      advisoryFooter:
        'CropShield AI खेती की सामान्य बातें सरल तरीके से समझाता है और जरूरत पड़ने पर अतिरिक्त जानकारी पूछता है। रासायनिक छिड़काव या बड़े निवेश से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या प्रमाणित कृषि विशेषज्ञ से परामर्श अवश्य लें।',
      emptyResponseError: 'कृषि सहायक से खाली उत्तर मिला। कृपया पुनः प्रयास करें।',
      signOutHint: 'नया सत्र शुरू करने के लिए ऊपर दाईं ओर साइन आउट बटन पर क्लिक करें।',
      unexpectedErrorPrefix: 'अप्रत्याशित त्रुटि',
      genericFallbackError: 'कृषि सहायक से संपर्क करते समय अप्रत्याशित त्रुटि हुई।',
    },
    disease: {
      title: 'फसल रोग पत्ती फोटो जांच',
      subtitle: 'AI द्वारा पत्तियों पर दिखने वाले लक्षणों की जांच और सामान्य बचाव के उपाय जानने के लिए दिन की रोशनी में ली गई साफ तस्वीर अपलोड करें।',
      trySampleBtn: 'नमूना टमाटर की पत्ती आज़माएं',
      step1Title: '1. पत्ती की तस्वीर अपलोड करें',
      previewAlt: 'अपलोड की गई फसल की पत्ती',
      changePhotoText: 'दूसरी तस्वीर चुनने के लिए यहाँ क्लिक करें',
      selectPhotoTitle: 'पत्ती की तस्वीर चुनने के लिए क्लिक करें',
      selectPhotoHint: '8 MB तक JPG, PNG या WebP · प्राकृतिक दिन की रोशनी सबसे बेहतर होती है',
      cropHintLabel: 'फसल का नाम (वैकल्पिक — सटीकता बढ़ाने के लिए)',
      cropHintPlaceholder: 'जैसे टमाटर, धान, कपास, गेहूं',
      notesLabel: 'खेत में दिखे लक्षण (वैकल्पिक)',
      notesPlaceholder: 'जैसे हाल की बारिश के बाद निचली पत्तियों पर धब्बे दिखे',
      analyzingBtn: 'पत्ती की तस्वीर की जांच हो रही है...',
      analyzeBtn: 'Gemini AI से पत्ती की जांच करें',
      disclaimer:
        'अस्वीकरण: तस्वीर द्वारा AI जांच केवल प्रारंभिक जानकारी के लिए है, यह प्रयोगशाला द्वारा पुष्ट कृषि रोग निदान नहीं है।',
      step2Title: '2. दृश्य जांच रिपोर्ट',
      emptyTitle: 'शुरू करने के लिए पत्ती की तस्वीर अपलोड करें या नमूना पत्ती लोड करें',
      emptyDesc:
        'Gemini पत्ती पर दिखने वाले धब्बों, रंग बदलाव और पैटर्न की जांच करेगा और संभावित कारण, अनिश्चितता व सुरक्षित बचाव के उपाय बताएगा।',
      loadingDesc: 'पत्ती की बनावट, धब्बों और दिखने वाले लक्षणों की जांच हो रही है...',
      screeningBadgePrefix: 'केवल प्रारंभिक दृश्य जांच (पुष्ट निदान नहीं):',
      notLeafWarning:
        'इस तस्वीर में पौधे या फसल की पत्ती स्पष्ट रूप से दिखाई नहीं दे रही है। कृपया अच्छी रोशनी में पास से ली गई पत्ती की तस्वीर अपलोड करें।',
      possibleCropLabel: 'संभावित फसल की पहचान',
      confidenceUncertaintyLabel: 'दृश्य विश्वास और अनिश्चितता',
      confidencePrefix: 'विश्वास स्तर',
      visibleSymptomsTitle: 'दिखाई देने वाले लक्षण',
      noSymptomsNote: 'कोई स्पष्ट रोग धब्बे दिखाई नहीं दिए।',
      possibleConditionsTitle: 'संभावित रोग या तनाव के कारण',
      preventiveTitle: 'सामान्य बचाव और खेत देखभाल के उपाय',
      kvkFooter:
        'रासायनिक दवा खरीदने से पहले ताजी पत्ती का नमूना अपने नजदीकी कृषि विज्ञान केंद्र (KVK) में अवश्य दिखाएं।',
      errInvalidFileType: 'अमान्य फाइल प्रकार। कृपया JPEG, PNG या WebP तस्वीर अपलोड करें।',
      errMaxSize: 'तस्वीर 8 MB से बड़ी है। कृपया छोटी तस्वीर चुनें।',
      errReadFailed: 'तस्वीर फाइल पढ़ने में समस्या हुई।',
      errLoadSample: 'नमूना पत्ती लोड नहीं हो सकी। कृपया अपने डिवाइस से तस्वीर अपलोड करें।',
      errNoImage: 'कृपया पहले फसल के पत्ते की तस्वीर अपलोड करें।',
      errFallback: 'अभी इस तस्वीर का विश्लेषण नहीं हो सका। कृपया पुनः प्रयास करें।',
    },
    advisor: {
      title: 'AI फसल सुझाव सलाहकार',
      subtitle: 'अपने खेत की परिस्थितियाँ दर्ज करें और सरल कारणों के साथ उपयुक्त फसलों के सुझाव पाएं।',
      fillSampleBtn: 'नमूना क्षेत्रीय डेटा भरें',
      formTitle: 'खेत और जलवायु जानकारी',
      simulatedBanner:
        'प्रदर्शन के लिए नमूना क्षेत्रीय मान भरे गए हैं। अपने वास्तविक खेत के अनुसार कोई भी जानकारी बदल सकते हैं।',
      locationLabel: 'स्थान (जिला, राज्य)',
      locationPlaceholder: 'जैसे लुधियाना, पंजाब',
      sampleLocationValue: 'नासिक, महाराष्ट्र (नमूना)',
      soilTypeLabel: 'मिट्टी का प्रकार',
      soilPhLabel: 'मिट्टी का pH (यदि पता हो)',
      soilPhPlaceholder: 'जैसे 6.5 या खाली छोड़ें',
      temperatureLabel: 'सामान्य तापमान (°C)',
      rainfallLabel: 'मासिक / मौसमी वर्षा (mm)',
      waterLabel: 'पानी / सिंचाई की उपलब्धता',
      seasonLabel: 'खेती का मौसम',
      generatingBtn: 'फसल सुझाव तैयार किए जा रहे हैं...',
      submitBtn: 'फसल सुझाव प्राप्त करें',
      honestyNote:
        'CropShield AI केवल आपके द्वारा दर्ज की गई जानकारी का उपयोग करता है और नकली लाइव मौसम या मिट्टी लैब डेटा नहीं बनाता।',
      emptyTitle: 'आपकी उपयुक्त फसलों के सुझाव यहाँ दिखेंगे',
      emptyDesc:
        'अपना स्थान, मिट्टी का प्रकार, पानी की उपलब्धता और मौसम दर्ज करें ताकि कारणों सहित उपयुक्त फसलें देख सकें।',
      loadingDesc: 'आपकी मिट्टी, मौसम और पानी के अनुसार फसलों का मिलान किया जा रहा है...',
      resultsSimulatedNote:
        'ध्यान दें: ये सुझाव आपके द्वारा लोड किए गए नमूना क्षेत्रीय जलवायु डेटा पर आधारित हैं।',
      whySuitableTitle: 'यह फसल आपकी स्थिति के लिए क्यों उपयुक्त है:',
      soilWaterNotesTitle: 'मिट्टी और पानी संबंधी बातें',
      cautionTitle: 'सावधानियां और ध्यान रखने योग्य बातें',
      generalAdvisoryLabel: 'सामान्य सलाह:',
      missingContextLabel: 'अतिरिक्त जानकारी / मिट्टी जांच:',
      errFallback: 'अभी फसल सुझाव तैयार नहीं किए जा सके।',
    },
    marketplace: {
      title: 'कृषि विक्रेता बाज़ार',
      subtitle: 'बीज, जैव-उर्वरक, जैविक फसल सुरक्षा और ड्रिप सिंचाई किट के नमूना विक्रेताओं की जानकारी देखें।',
      defaultNotice: 'हैकथॉन प्रदर्शन के लिए नमूना विक्रेता सूची · इसमें कोई वास्तविक भुगतान नहीं होता।',
      imageAlt: 'नमूना जैविक नीम खाद और फसल बीज',
      searchPlaceholder: 'बीज, नीम, ड्रिप किट खोजें...',
      searchAria: 'बाज़ार उत्पाद खोजें',
      loadingText: 'नमूना विक्रेता सूची लोड हो रही है...',
      noResults: 'कोई मिलता-जुलता उत्पाद नहीं मिला',
      resetFilters: 'फ़िल्टर रीसेट करें',
      ownerPrefix: 'मालिक',
      yearsActiveSuffix: 'वर्ष अनुभव',
      sampleListing: 'नमूना सूची',
      specializationPrefix: 'विशेषज्ञता',
      contactSupplierBtn: 'विक्रेता से संपर्क करें',
      usageNotePrefix: 'उपयोग विधि:',
      contactModalTitlePrefix: 'संपर्क करें:',
      sampleSupplierContact: 'नमूना विक्रेता संपर्क विवरण',
      closeModalAria: 'मोडल बंद करें',
      selectedProductPrefix: 'चयनित उत्पाद:',
      indicativePricePrefix: 'अनुमानित ₹',
      inquiryRecordedTitle: 'पूछताछ दर्ज हो गई',
      yourInquiryLabel: 'आपका पूछताछ संदेश',
      cancelBtn: 'रद्द करें',
      sendingBtn: 'भेजा जा रहा है...',
      sendInquiryBtn: 'डेमो पूछताछ भेजें',
      demoNoticeFooter: 'हैकथॉन प्रदर्शन सूचना: इस प्रोटोटाइप में कोई ऑनलाइन भुगतान या वास्तविक ऑर्डर नहीं होते।',
      defaultProductInquiry: (owner, product, pack) =>
        `नमस्ते ${owner} जी, मैं ${product} (${pack}) की उपलब्धता और डिलीवरी के बारे में जानकारी चाहता हूँ।`,
      defaultSupplierInquiry: (owner) =>
        `नमस्ते ${owner} जी, मैं आपके कृषि उत्पादों के बारे में जानकारी प्राप्त करना चाहता हूँ।`,
      errLoad: 'विक्रेताओं की सूची लोड नहीं हो सकी।',
      errInquiry: 'पूछताछ संदेश नहीं भेजा जा सका।',
    },
    profile: {
      title: 'किसान प्रोफ़ाइल सेटिंग्स',
      errUpdate: 'प्रोफ़ाइल अपडेट नहीं हो सकी।',
      savedNotice: 'प्रोफ़ाइल अपडेट होकर सहेजी गई।',
      languagePreferenceLabel: 'पसंदीदा भाषा',
      farmerNameLabel: 'किसान का नाम',
      villageLabel: 'गाँव / कस्बा',
      districtLabel: 'जिला',
      stateLabel: 'राज्य',
      farmSizeLabel: 'खेत का आकार (एकड़)',
      soilTypeLabel: 'मुख्य मिट्टी का प्रकार',
      primaryCropsLabel: 'मुख्य फसलें (कॉमा से अलग लिखें)',
      savingBtn: 'सहेजा जा रहा है...',
      saveBtn: 'प्रोफ़ाइल बदलाव सहेजें',
      historyTitle: 'सहेजी गई जांच और पूछताछ इतिहास',
      historyEmpty: 'अभी तक कोई पत्ती जांच, फसल सुझाव या विक्रेता पूछताछ दर्ज नहीं हुई है।',
      activityTypeLabel: {
        disease_check: 'पत्ती जांच',
        crop_recommendation: 'फसल सलाह',
        supplier_inquiry: 'विक्रेता पूछताछ',
      },
    },
  },
};

export function translateStateLabel(state: string, lang: AppLanguage): string {
  return STATE_LABELS[state]?.[lang] ?? state;
}

export function translateSoilLabel(soil: string, lang: AppLanguage): string {
  return SOIL_LABELS[soil]?.[lang] ?? soil;
}

export function translateWaterOption(option: string, lang: AppLanguage): string {
  return WATER_OPTION_LABELS[option]?.[lang] ?? option;
}

export function translateAdvisorSeason(season: string, lang: AppLanguage): string {
  return ADVISOR_SEASON_LABELS[season]?.[lang] ?? season;
}

export function translateCropSeason(season: TrackedCrop['season'], lang: AppLanguage): string {
  return CROP_SEASON_LABELS[season]?.[lang] ?? season;
}

export function translateCategory(category: 'All' | SupplierProduct['category'], lang: AppLanguage): string {
  return CATEGORY_LABELS[category]?.[lang] ?? category;
}

export function translateConfidence(level: LeafAnalysisResult['confidenceLevel'], lang: AppLanguage): string {
  return CONFIDENCE_LABELS[level]?.[lang] ?? level;
}

export function getDisplaySampleCrop(
  crop: TrackedCrop,
  lang: AppLanguage
): { cropName: string; sowingStage: string; notes: string } {
  if (!crop.isSample || lang === 'en') {
    return { cropName: crop.cropName, sowingStage: crop.sowingStage, notes: crop.notes };
  }
  const tr = SAMPLE_CROP_TRANSLATIONS[crop.cropName]?.[lang];
  return tr ?? { cropName: crop.cropName, sowingStage: crop.sowingStage, notes: crop.notes };
}

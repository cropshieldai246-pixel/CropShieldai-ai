export interface SimulatedWeatherPreset {
  state: string;
  regionLabel: string;
  temperatureC: number;
  humidityPercent: number;
  rainfallMmMonthly: number;
  windKmh: number;
  condition: string;
  farmingTip: string;
  isSimulated: true;
  disclaimer: string;
}

export const SIMULATED_WEATHER_PRESETS: SimulatedWeatherPreset[] = [
  {
    state: 'Maharashtra',
    regionLabel: 'Nashik / Western Maharashtra',
    temperatureC: 29,
    humidityPercent: 58,
    rainfallMmMonthly: 110,
    windKmh: 12,
    condition: 'Mild Sun & Light Breeze',
    farmingTip: 'Good window for morning foliar inspection and drip irrigation checks.',
    isSimulated: true,
    disclaimer: 'Simulated sample weather data for hackathon demonstration — verify local IMD forecast before spraying.',
  },
  {
    state: 'Punjab',
    regionLabel: 'Ludhiana / Central Plains',
    temperatureC: 24,
    humidityPercent: 52,
    rainfallMmMonthly: 45,
    windKmh: 9,
    condition: 'Clear & Moderate',
    farmingTip: 'Favorable dry conditions for wheat field preparation and soil testing.',
    isSimulated: true,
    disclaimer: 'Simulated sample weather data for hackathon demonstration — verify local IMD forecast before spraying.',
  },
  {
    state: 'Uttar Pradesh',
    regionLabel: 'Lucknow / Gangetic Belt',
    temperatureC: 27,
    humidityPercent: 64,
    rainfallMmMonthly: 85,
    windKmh: 10,
    condition: 'Partly Cloudy',
    farmingTip: 'Check field drainage channels and monitor early leaf spots during humid mornings.',
    isSimulated: true,
    disclaimer: 'Simulated sample weather data for hackathon demonstration — verify local IMD forecast before spraying.',
  },
  {
    state: 'Karnataka',
    regionLabel: 'Mandya / Southern Plateau',
    temperatureC: 28,
    humidityPercent: 66,
    rainfallMmMonthly: 135,
    windKmh: 14,
    condition: 'Warm with Scattered Clouds',
    farmingTip: 'Ideal moisture for mulching around vegetable beds to conserve soil water.',
    isSimulated: true,
    disclaimer: 'Simulated sample weather data for hackathon demonstration — verify local IMD forecast before spraying.',
  },
  {
    state: 'Tamil Nadu',
    regionLabel: 'Thanjavur / Cauvery Delta',
    temperatureC: 31,
    humidityPercent: 74,
    rainfallMmMonthly: 165,
    windKmh: 15,
    condition: 'Humid Coastal Breeze',
    farmingTip: 'Keep paddy bunds clear and inspect lower leaves for sheath or fungal stress.',
    isSimulated: true,
    disclaimer: 'Simulated sample weather data for hackathon demonstration — verify local IMD forecast before spraying.',
  },
  {
    state: 'Madhya Pradesh',
    regionLabel: 'Indore / Malwa Plateau',
    temperatureC: 26,
    humidityPercent: 48,
    rainfallMmMonthly: 60,
    windKmh: 11,
    condition: 'Dry & Bright',
    farmingTip: 'Irrigate early morning or late evening to minimize evaporation loss.',
    isSimulated: true,
    disclaimer: 'Simulated sample weather data for hackathon demonstration — verify local IMD forecast before spraying.',
  },
];

export interface SupplierProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Bio-Fertilizers' | 'Organic Care' | 'Irrigation' | 'Soil Tools';
  packSize: string;
  indicativePriceInr: number;
  description: string;
  usageNote: string;
}

export interface SupplierProfile {
  id: string;
  businessName: string;
  ownerName: string;
  location: string;
  yearsActive: number;
  specialization: string;
  contactPhone: string;
  contactEmail: string;
  responseTime: string;
  isSampleListing: true;
  products: SupplierProduct[];
}

export const SAMPLE_SUPPLIERS: SupplierProfile[] = [
  {
    id: 'sup_sahayadri',
    businessName: 'Sahyadri Krishi Kendra',
    ownerName: 'Prakash Kulkarni',
    location: 'Nashik, Maharashtra',
    yearsActive: 11,
    specialization: 'Certified Seeds & Organic Neem Inputs',
    contactPhone: '+91 98200 00101 (Sample)',
    contactEmail: 'sahyadri.demo@cropshield.example',
    responseTime: 'Typically replies within 4 hours',
    isSampleListing: true,
    products: [
      {
        id: 'prod_1',
        name: 'Neem Cake Organic Soil Conditioner',
        category: 'Bio-Fertilizers',
        packSize: '25 kg sack',
        indicativePriceInr: 680,
        description: 'Cold-pressed organic neem cake rich in natural micronutrients to improve soil structure and root resilience.',
        usageNote: 'Mix into topsoil during field preparation before sowing.',
      },
      {
        id: 'prod_2',
        name: 'Cold-Pressed Neem Oil Bio-Spray (1500 ppm)',
        category: 'Organic Care',
        packSize: '1 Litre bottle',
        indicativePriceInr: 420,
        description: 'Botanical preventive spray suitable for early aphid, whitefly, and mite management in vegetable crops.',
        usageNote: 'Dilute as directed on pack label; spray during cool evening hours.',
      },
    ],
  },
  {
    id: 'sup_greenharvest',
    businessName: 'GreenHarvest Seed Co-op',
    ownerName: 'Harpreet Singh Gill',
    location: 'Ludhiana, Punjab',
    yearsActive: 14,
    specialization: 'High-Germination Cereal & Pulse Seeds',
    contactPhone: '+91 98200 00202 (Sample)',
    contactEmail: 'greenharvest.demo@cropshield.example',
    responseTime: 'Typically replies same day',
    isSampleListing: true,
    products: [
      {
        id: 'prod_3',
        name: 'HD-2967 Certified Wheat Seed',
        category: 'Seeds',
        packSize: '40 kg bag',
        indicativePriceInr: 1450,
        description: 'Widely adopted Rabi wheat variety known for strong tillering and good tolerance to common yellow rust.',
        usageNote: 'Suitable for timely November sowing in irrigated loamy plains.',
      },
      {
        id: 'prod_4',
        name: 'Pusa Basmati 1509 Paddy Seed',
        category: 'Seeds',
        packSize: '10 kg bag',
        indicativePriceInr: 980,
        description: 'Short-duration aromatic paddy variety helping conserve late-season irrigation water.',
        usageNote: 'Raise healthy nursery seedlings for 21–25 days before transplanting.',
      },
    ],
  },
  {
    id: 'sup_kaveri_drip',
    businessName: 'Kaveri Micro-Irrigation Works',
    ownerName: 'Lakshmi Narayanan',
    location: 'Coimbatore, Tamil Nadu',
    yearsActive: 9,
    specialization: 'Water-Saving Drip Kits & Soil Moisture Tools',
    contactPhone: '+91 98200 00303 (Sample)',
    contactEmail: 'kaveridrip.demo@cropshield.example',
    responseTime: 'Typically replies within 6 hours',
    isSampleListing: true,
    products: [
      {
        id: 'prod_5',
        name: 'Gravity-Fed 0.5 Acre Vegetable Drip Kit',
        category: 'Irrigation',
        packSize: 'Complete Starter Kit',
        indicativePriceInr: 4850,
        description: 'Easy-to-assemble inline drip laterals, screen filter, and fittings designed for small horticultural plots.',
        usageNote: 'Delivers water directly to root zones and keeps foliage dry.',
      },
      {
        id: 'prod_6',
        name: 'Manual Soil pH & Moisture Tester Probe',
        category: 'Soil Tools',
        packSize: '1 Unit (Battery-Free)',
        indicativePriceInr: 590,
        description: 'Quick field check probe for approximate topsoil moisture and pH reading before irrigation.',
        usageNote: 'Wipe metal tip clean before and after each reading; pair with lab Soil Health Card for exact NPK.',
      },
    ],
  },
  {
    id: 'sup_bhumi_bio',
    businessName: 'Bhumi Mitr Bio-Inputs',
    ownerName: 'Ananya Deshmukh',
    location: 'Indore, Madhya Pradesh',
    yearsActive: 7,
    specialization: 'Vermicompost & Microbial Bio-Fertilizers',
    contactPhone: '+91 98200 00404 (Sample)',
    contactEmail: 'bhumimitr.demo@cropshield.example',
    responseTime: 'Typically replies within 3 hours',
    isSampleListing: true,
    products: [
      {
        id: 'prod_7',
        name: 'Enriched Vermicompost Granules',
        category: 'Bio-Fertilizers',
        packSize: '50 kg bag',
        indicativePriceInr: 520,
        description: 'Well-decomposed earthworm compost improving soil water retention and beneficial microbial activity.',
        usageNote: 'Apply around root zone or mix with basal compost.',
      },
      {
        id: 'prod_8',
        name: 'Trichoderma Viride Bio-Protectant Powder',
        category: 'Organic Care',
        packSize: '1 kg pouch',
        indicativePriceInr: 260,
        description: 'Beneficial fungal culture used with compost or seed treatment to support soil-borne root health.',
        usageNote: 'Store in cool dry shade away from direct sunlight.',
      },
    ],
  },
];

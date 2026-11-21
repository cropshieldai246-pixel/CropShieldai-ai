export type AppLanguage = 'en' | 'te' | 'hi';

export type NavTab =
  | 'dashboard'
  | 'assistant'
  | 'disease'
  | 'advisor'
  | 'marketplace'
  | 'profile';

export interface FarmerProfile {
  id: string;
  name: string;
  identifier: string;
  village: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  soilType: string;
  primaryCrops: string[];
  isDemo?: boolean;
  createdAt: string;
}

export interface TrackedCrop {
  id: string;
  farmerId: string;
  cropName: string;
  variety: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
  areaAcres: number;
  sowingStage: string;
  notes: string;
  isSample?: boolean;
  updatedAt: string;
}

export interface WeatherPreset {
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface LeafAnalysisResult {
  isPlantLeaf: boolean;
  possibleCrop: string;
  visibleSymptoms: string[];
  possibleConditions: Array<{
    name: string;
    likelihoodNote: string;
    explanation: string;
  }>;
  confidenceLevel: 'Low' | 'Moderate' | 'High';
  uncertaintyNotes: string;
  preventivePractices: string[];
  expertRecommendation: string;
}

export interface CropRecommendationResult {
  recommendations: Array<{
    cropName: string;
    seasonFit: string;
    suitabilitySummary: string;
    whySuitable: string[];
    waterAndSoilNotes: string;
    cautionNote: string;
  }>;
  generalAdvisory: string;
  missingContextNote: string;
}

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

export interface ActivityRecord {
  id: string;
  farmerId: string;
  type: 'disease_check' | 'crop_recommendation' | 'supplier_inquiry';
  title: string;
  summary: string;
  createdAt: string;
}

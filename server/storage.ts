import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface FarmerProfile {
  id: string;
  name: string;
  identifier: string; // email or phone number
  passwordHash: string;
  village: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  soilType: string;
  primaryCrops: string[];
  isDemo?: boolean;
  createdAt: string;
}

export type PublicFarmerProfile = Omit<FarmerProfile, 'passwordHash'>;

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

export interface ActivityRecord {
  id: string;
  farmerId: string;
  type: 'disease_check' | 'crop_recommendation' | 'supplier_inquiry';
  title: string;
  summary: string;
  createdAt: string;
}

interface DatabaseState {
  farmers: FarmerProfile[];
  crops: TrackedCrop[];
  activities: ActivityRecord[];
}

interface SessionRecord {
  token: string;
  farmerId: string;
  createdAt: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'cropshield-db.json');

const sessions = new Map<string, SessionRecord>();

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): DatabaseState {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    const initial: DatabaseState = { farmers: [], crops: [], activities: [] };
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DatabaseState>;
    return {
      farmers: Array.isArray(parsed.farmers) ? parsed.farmers : [],
      crops: Array.isArray(parsed.crops) ? parsed.crops : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    };
  } catch {
    return { farmers: [], crops: [], activities: [] };
  }
}

function writeDb(state: DatabaseState): void {
  ensureDataDir();
  const tmpPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2), 'utf8');
  fs.renameSync(tmpPath, DB_PATH);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  try {
    const keyBuf = Buffer.from(keyHex, 'hex');
    const derivedBuf = crypto.scryptSync(password, salt, 64);
    if (keyBuf.length !== derivedBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, derivedBuf);
  } catch {
    return false;
  }
}

export function sanitizeFarmer(farmer: FarmerProfile): PublicFarmerProfile {
  const { passwordHash: _omitted, ...safe } = farmer;
  return safe;
}

export function createSession(farmerId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    token,
    farmerId,
    createdAt: Date.now(),
  });
  return token;
}

export function getFarmerByToken(token: string): PublicFarmerProfile | null {
  const session = sessions.get(token);
  if (!session) return null;
  const db = readDb();
  const farmer = db.farmers.find((f) => f.id === session.farmerId);
  return farmer ? sanitizeFarmer(farmer) : null;
}

export function revokeSession(token: string): void {
  sessions.delete(token);
}

function seedSampleCropsForFarmer(farmerId: string, db: DatabaseState): void {
  const now = new Date().toISOString();
  db.crops.push(
    {
      id: `crop_${crypto.randomUUID()}`,
      farmerId,
      cropName: 'Paddy (Rice)',
      variety: 'Swarna / MTU-7029',
      season: 'Kharif',
      areaAcres: 2.5,
      sowingStage: 'Vegetative Growth (Day 38)',
      notes: 'Sample tracked crop · Maintain 3–5 cm standing water and inspect leaf tips weekly.',
      isSample: true,
      updatedAt: now,
    },
    {
      id: `crop_${crypto.randomUUID()}`,
      farmerId,
      cropName: 'Wheat',
      variety: 'HD-2967',
      season: 'Rabi',
      areaAcres: 1.5,
      sowingStage: 'Planned for Sowing',
      notes: 'Sample tracked crop · Prepare fine seedbed and check soil moisture before sowing.',
      isSample: true,
      updatedAt: now,
    },
    {
      id: `crop_${crypto.randomUUID()}`,
      farmerId,
      cropName: 'Tomato',
      variety: 'Arka Rakshak',
      season: 'Zaid',
      areaAcres: 0.5,
      sowingStage: 'Flowering & Early Fruit',
      notes: 'Sample tracked crop · Water at plant base in morning to reduce fungal leaf spot risk.',
      isSample: true,
      updatedAt: now,
    }
  );
}

export function registerFarmer(input: {
  name: string;
  identifier: string;
  password: string;
  village: string;
  district: string;
  state: string;
  farmSizeAcres: number;
  soilType: string;
  primaryCrops: string[];
}): { farmer: PublicFarmerProfile; token: string } {
  const db = readDb();
  const normalizedId = input.identifier.trim().toLowerCase();
  const exists = db.farmers.some((f) => f.identifier.toLowerCase() === normalizedId);
  if (exists) {
    throw new Error('ACCOUNT_EXISTS');
  }

  const farmer: FarmerProfile = {
    id: `farmer_${crypto.randomUUID()}`,
    name: input.name.trim(),
    identifier: normalizedId,
    passwordHash: hashPassword(input.password),
    village: input.village.trim() || 'Rampur',
    district: input.district.trim() || 'Nashik',
    state: input.state.trim() || 'Maharashtra',
    farmSizeAcres: Number.isFinite(input.farmSizeAcres) && input.farmSizeAcres > 0 ? input.farmSizeAcres : 2.5,
    soilType: input.soilType.trim() || 'Loamy',
    primaryCrops: input.primaryCrops.length > 0 ? input.primaryCrops : ['Paddy', 'Wheat'],
    isDemo: false,
    createdAt: new Date().toISOString(),
  };

  db.farmers.push(farmer);
  seedSampleCropsForFarmer(farmer.id, db);
  writeDb(db);

  const token = createSession(farmer.id);
  return { farmer: sanitizeFarmer(farmer), token };
}

export function loginFarmer(identifier: string, password: string): { farmer: PublicFarmerProfile; token: string } | null {
  const db = readDb();
  const normalizedId = identifier.trim().toLowerCase();
  const farmer = db.farmers.find((f) => f.identifier.toLowerCase() === normalizedId && !f.isDemo);
  if (!farmer) return null;
  if (!verifyPassword(password, farmer.passwordHash)) return null;
  const token = createSession(farmer.id);
  return { farmer: sanitizeFarmer(farmer), token };
}

export function getOrCreateDemoFarmerSession(): { farmer: PublicFarmerProfile; token: string } {
  const db = readDb();
  let demoFarmer = db.farmers.find((f) => f.isDemo === true);
  if (!demoFarmer) {
    demoFarmer = {
      id: 'farmer_demo_india',
      name: 'Ramesh Verma',
      identifier: 'demo-farmer@cropshield.local',
      passwordHash: '', // Demo access uses dedicated /api/auth/demo session only
      village: 'Sinnar',
      district: 'Nashik',
      state: 'Maharashtra',
      farmSizeAcres: 4.5,
      soilType: 'Black Cotton (Vertisol)',
      primaryCrops: ['Paddy', 'Tomato', 'Wheat'],
      isDemo: true,
      createdAt: new Date().toISOString(),
    };
    db.farmers.push(demoFarmer);
    seedSampleCropsForFarmer(demoFarmer.id, db);
    writeDb(db);
  }
  const token = createSession(demoFarmer.id);
  return { farmer: sanitizeFarmer(demoFarmer), token };
}

export function updateFarmerProfile(
  farmerId: string,
  updates: {
    name?: string;
    village?: string;
    district?: string;
    state?: string;
    farmSizeAcres?: number;
    soilType?: string;
    primaryCrops?: string[];
  }
): PublicFarmerProfile | null {
  const db = readDb();
  const idx = db.farmers.findIndex((f) => f.id === farmerId);
  if (idx === -1) return null;

  const current = db.farmers[idx];
  const updated: FarmerProfile = {
    ...current,
    name: updates.name?.trim() ? updates.name.trim().slice(0, 80) : current.name,
    village: updates.village?.trim() ? updates.village.trim().slice(0, 80) : current.village,
    district: updates.district?.trim() ? updates.district.trim().slice(0, 80) : current.district,
    state: updates.state?.trim() ? updates.state.trim().slice(0, 80) : current.state,
    farmSizeAcres:
      typeof updates.farmSizeAcres === 'number' && Number.isFinite(updates.farmSizeAcres) && updates.farmSizeAcres > 0 && updates.farmSizeAcres <= 10000
        ? updates.farmSizeAcres
        : current.farmSizeAcres,
    soilType: updates.soilType?.trim() ? updates.soilType.trim().slice(0, 60) : current.soilType,
    primaryCrops: Array.isArray(updates.primaryCrops)
      ? updates.primaryCrops.map((c) => c.trim()).filter(Boolean).slice(0, 12)
      : current.primaryCrops,
  };

  db.farmers[idx] = updated;
  writeDb(db);
  return sanitizeFarmer(updated);
}

export function getFarmerCrops(farmerId: string): TrackedCrop[] {
  const db = readDb();
  return db.crops.filter((c) => c.farmerId === farmerId);
}

export function addFarmerCrop(
  farmerId: string,
  input: {
    cropName: string;
    variety: string;
    season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial';
    areaAcres: number;
    sowingStage: string;
    notes: string;
  }
): TrackedCrop {
  const db = readDb();
  const crop: TrackedCrop = {
    id: `crop_${crypto.randomUUID()}`,
    farmerId,
    cropName: input.cropName.trim().slice(0, 80),
    variety: input.variety.trim().slice(0, 80) || 'Local Standard',
    season: input.season,
    areaAcres: Number.isFinite(input.areaAcres) && input.areaAcres > 0 ? input.areaAcres : 1,
    sowingStage: input.sowingStage.trim().slice(0, 80) || 'Vegetative',
    notes: input.notes.trim().slice(0, 300),
    isSample: false,
    updatedAt: new Date().toISOString(),
  };
  db.crops.unshift(crop);
  writeDb(db);
  return crop;
}

export function deleteFarmerCrop(farmerId: string, cropId: string): boolean {
  const db = readDb();
  const initialLen = db.crops.length;
  db.crops = db.crops.filter((c) => !(c.id === cropId && c.farmerId === farmerId));
  if (db.crops.length === initialLen) return false;
  writeDb(db);
  return true;
}

export function addActivity(
  farmerId: string,
  type: ActivityRecord['type'],
  title: string,
  summary: string
): ActivityRecord {
  const db = readDb();
  const record: ActivityRecord = {
    id: `act_${crypto.randomUUID()}`,
    farmerId,
    type,
    title: title.slice(0, 120),
    summary: summary.slice(0, 320),
    createdAt: new Date().toISOString(),
  };
  db.activities.unshift(record);
  // Keep recent 30 records per farmer
  const farmerActs = db.activities.filter((a) => a.farmerId === farmerId).slice(0, 30);
  const otherActs = db.activities.filter((a) => a.farmerId !== farmerId);
  db.activities = [...farmerActs, ...otherActs];
  writeDb(db);
  return record;
}

export function getFarmerActivities(farmerId: string): ActivityRecord[] {
  const db = readDb();
  return db.activities.filter((a) => a.farmerId === farmerId).slice(0, 20);
}

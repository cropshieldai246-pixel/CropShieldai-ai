import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import {
  analyzeCropLeafImage,
  GeminiServiceError,
  generateCropRecommendations,
  runFarmingAssistantChat,
} from './server/gemini.ts';
import {
  getLocalizedSuppliers,
  getLocalizedWeatherPresets,
  getServerMessage,
  normalizeLanguage,
  SupportedLanguage,
} from './server/i18n.ts';
import {
  addActivity,
  addFarmerCrop,
  deleteFarmerCrop,
  getFarmerActivities,
  getFarmerByToken,
  getFarmerCrops,
  getOrCreateDemoFarmerSession,
  loginFarmer,
  PublicFarmerProfile,
  registerFarmer,
  revokeSession,
  updateFarmerProfile,
} from './server/storage.ts';

interface AuthenticatedRequest extends Request {
  farmer?: PublicFarmerProfile;
  authToken?: string;
}

function getRequestLanguage(req: Request): SupportedLanguage {
  const bodyLang = req.body && typeof req.body === 'object' ? (req.body as { language?: unknown }).language : undefined;
  const queryLang = req.query.lang;
  const headerLang = req.headers['x-cropshield-lang'];
  return normalizeLanguage(bodyLang ?? queryLang ?? headerLang);
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const lang = getRequestLanguage(req);
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: getServerMessage('AUTH_REQUIRED', lang) });
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  const farmer = getFarmerByToken(token);
  if (!farmer) {
    res.status(401).json({ error: getServerMessage('SESSION_EXPIRED', lang) });
    return;
  }
  req.farmer = farmer;
  req.authToken = token;
  next();
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'CropShield AI' });
  });

  // --- Auth Routes ---
  app.post('/api/auth/register', (req, res) => {
    const lang = getRequestLanguage(req);
    try {
      const { name, identifier, password, village, district, state, farmSizeAcres, soilType, primaryCrops } = req.body ?? {};
      if (typeof name !== 'string' || name.trim().length < 2) {
        res.status(400).json({ error: getServerMessage('INVALID_NAME', lang) });
        return;
      }
      if (typeof identifier !== 'string' || identifier.trim().length < 3) {
        res.status(400).json({ error: getServerMessage('INVALID_IDENTIFIER', lang) });
        return;
      }
      if (typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ error: getServerMessage('INVALID_PASSWORD', lang) });
        return;
      }

      const result = registerFarmer({
        name: name.slice(0, 80),
        identifier: identifier.slice(0, 100),
        password,
        village: typeof village === 'string' ? village.slice(0, 80) : '',
        district: typeof district === 'string' ? district.slice(0, 80) : '',
        state: typeof state === 'string' ? state.slice(0, 80) : 'Maharashtra',
        farmSizeAcres: Number(farmSizeAcres) || 2.5,
        soilType: typeof soilType === 'string' ? soilType.slice(0, 60) : 'Loamy',
        primaryCrops: Array.isArray(primaryCrops)
          ? primaryCrops.filter((c): c is string => typeof c === 'string').slice(0, 10)
          : ['Paddy', 'Wheat'],
      });

      res.status(201).json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'ACCOUNT_EXISTS') {
        res.status(409).json({ error: getServerMessage('ACCOUNT_EXISTS', lang) });
        return;
      }
      res.status(500).json({ error: getServerMessage('REGISTER_FAILED', lang) });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const lang = getRequestLanguage(req);
    const { identifier, password } = req.body ?? {};
    if (typeof identifier !== 'string' || typeof password !== 'string' || !identifier.trim() || !password) {
      res.status(400).json({ error: getServerMessage('MISSING_LOGIN_CREDENTIALS', lang) });
      return;
    }
    const result = loginFarmer(identifier, password);
    if (!result) {
      res.status(401).json({ error: getServerMessage('INVALID_LOGIN_CREDENTIALS', lang) });
      return;
    }
    res.json(result);
  });

  app.post('/api/auth/demo', (_req, res) => {
    const result = getOrCreateDemoFarmerSession();
    res.json(result);
  });

  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.authToken) {
      revokeSession(req.authToken);
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({ farmer: req.farmer });
  });

  // --- Farmer Profile & Crops ---
  app.put('/api/farmer/profile', requireAuth, (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    const farmer = req.farmer!;
    const { name, village, district, state, farmSizeAcres, soilType, primaryCrops } = req.body ?? {};
    const updated = updateFarmerProfile(farmer.id, {
      name: typeof name === 'string' ? name : undefined,
      village: typeof village === 'string' ? village : undefined,
      district: typeof district === 'string' ? district : undefined,
      state: typeof state === 'string' ? state : undefined,
      farmSizeAcres: farmSizeAcres !== undefined ? Number(farmSizeAcres) : undefined,
      soilType: typeof soilType === 'string' ? soilType : undefined,
      primaryCrops: Array.isArray(primaryCrops)
        ? primaryCrops.filter((c): c is string => typeof c === 'string')
        : undefined,
    });
    if (!updated) {
      res.status(404).json({ error: getServerMessage('PROFILE_NOT_FOUND', lang) });
      return;
    }
    res.json({ farmer: updated });
  });

  app.get('/api/farmer/crops', requireAuth, (req: AuthenticatedRequest, res) => {
    const crops = getFarmerCrops(req.farmer!.id);
    res.json({ crops });
  });

  app.post('/api/farmer/crops', requireAuth, (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    const { cropName, variety, season, areaAcres, sowingStage, notes } = req.body ?? {};
    if (typeof cropName !== 'string' || cropName.trim().length < 2) {
      res.status(400).json({ error: getServerMessage('INVALID_CROP_NAME', lang) });
      return;
    }
    const validSeasons = ['Kharif', 'Rabi', 'Zaid', 'Perennial'] as const;
    const normalizedSeason = validSeasons.includes(season) ? season : 'Kharif';

    const crop = addFarmerCrop(req.farmer!.id, {
      cropName,
      variety: typeof variety === 'string' ? variety : '',
      season: normalizedSeason,
      areaAcres: Number(areaAcres) || 1,
      sowingStage: typeof sowingStage === 'string' ? sowingStage : 'Vegetative',
      notes: typeof notes === 'string' ? notes : '',
    });
    res.status(201).json({ crop });
  });

  app.delete('/api/farmer/crops/:id', requireAuth, (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    const deleted = deleteFarmerCrop(req.farmer!.id, String(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: getServerMessage('CROP_NOT_FOUND', lang) });
      return;
    }
    res.json({ ok: true });
  });

  app.get('/api/farmer/history', requireAuth, (req: AuthenticatedRequest, res) => {
    const activities = getFarmerActivities(req.farmer!.id);
    res.json({ activities });
  });

  // --- Simulated Weather Presets & Sample Marketplace ---
  app.get('/api/weather', requireAuth, (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    const requestedState = typeof req.query.state === 'string' ? req.query.state : req.farmer!.state;
    const presets = getLocalizedWeatherPresets(lang);
    const matched =
      presets.find((w) => w.state.toLowerCase() === requestedState.toLowerCase()) || presets[0];
    res.json({
      current: matched,
      presets,
    });
  });

  app.get('/api/suppliers', requireAuth, (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    res.json({
      suppliers: getLocalizedSuppliers(lang),
      notice: getServerMessage('MARKETPLACE_NOTICE', lang),
    });
  });

  app.post('/api/suppliers/inquire', requireAuth, (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    const { supplierName, productName, message } = req.body ?? {};
    if (typeof supplierName !== 'string' || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: getServerMessage('INQUIRY_EMPTY', lang) });
      return;
    }
    const record = addActivity(
      req.farmer!.id,
      'supplier_inquiry',
      `${supplierName.slice(0, 60)}`,
      `${productName ? `${String(productName).slice(0, 60)} · ` : ''}${message.trim().slice(0, 200)}`
    );
    res.status(201).json({
      ok: true,
      record,
      note: getServerMessage('INQUIRY_NOTE', lang),
    });
  });

  // --- Gemini AI Endpoints ---
  app.post('/api/ai/chat', requireAuth, async (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    try {
      const { messages, includeFarmContext } = req.body ?? {};
      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: getServerMessage('CHAT_EMPTY', lang) });
        return;
      }
      const sanitizedMessages = messages
        .slice(-16)
        .filter(
          (m): m is { role: 'user' | 'model'; text: string } =>
            Boolean(m) &&
            (m.role === 'user' || m.role === 'model') &&
            typeof m.text === 'string' &&
            m.text.trim().length > 0
        )
        .map((m) => ({
          role: m.role,
          text: m.text.slice(0, 2500),
        }));

      if (sanitizedMessages.length === 0) {
        res.status(400).json({ error: getServerMessage('CHAT_EMPTY', lang), code: 'BAD_INPUT' });
        return;
      }

      const farmer = req.farmer!;
      const reply = await runFarmingAssistantChat(
        sanitizedMessages,
        includeFarmContext !== false
          ? {
              state: farmer.state,
              district: farmer.district,
              soilType: farmer.soilType,
              primaryCrops: farmer.primaryCrops,
            }
          : undefined,
        lang
      );

      res.json({ reply });
    } catch (err) {
      if (err instanceof GeminiServiceError) {
        console.warn(`[CropShield API /api/ai/chat] ${err.status} ${err.code}: ${err.message}`);
        res.status(err.status).json({ error: err.message, code: err.code, detail: err.detail });
        return;
      }
      const message = err instanceof Error ? err.message : 'Unexpected server error';
      console.error('[CropShield API /api/ai/chat] Unexpected error:', message);
      res.status(500).json({
        error: `${getServerMessage('CHAT_UNEXPECTED', lang)} (${message})`,
        code: 'INTERNAL_ERROR',
      });
    }
  });

  app.post('/api/ai/analyze-leaf', requireAuth, async (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    try {
      const { imageBase64, mimeType, cropHint, notes } = req.body ?? {};
      if (typeof imageBase64 !== 'string' || typeof mimeType !== 'string') {
        res.status(400).json({ error: getServerMessage('LEAF_MISSING', lang) });
        return;
      }
      const analysis = await analyzeCropLeafImage({
        imageBase64,
        mimeType,
        cropHint: typeof cropHint === 'string' ? cropHint.slice(0, 80) : undefined,
        notes: typeof notes === 'string' ? notes.slice(0, 300) : undefined,
        language: lang,
      });

      const primaryCondition = analysis.possibleConditions[0]?.name || analysis.possibleCrop;
      addActivity(
        req.farmer!.id,
        'disease_check',
        `${analysis.possibleCrop}`,
        `${primaryCondition} (${analysis.confidenceLevel})`
      );

      res.json({ analysis });
    } catch (err) {
      if (err instanceof GeminiServiceError) {
        res.status(err.status).json({ error: err.message, code: err.code, detail: err.detail });
        return;
      }
      res.status(500).json({ error: getServerMessage('LEAF_UNEXPECTED', lang) });
    }
  });

  app.post('/api/ai/recommend-crops', requireAuth, async (req: AuthenticatedRequest, res) => {
    const lang = getRequestLanguage(req);
    try {
      const { location, soilType, soilPh, temperatureC, rainfallMm, waterAvailability, season, isSimulatedData } =
        req.body ?? {};

      if (
        typeof location !== 'string' ||
        !location.trim() ||
        typeof soilType !== 'string' ||
        !soilType.trim() ||
        typeof season !== 'string' ||
        !season.trim() ||
        typeof waterAvailability !== 'string' ||
        !waterAvailability.trim()
      ) {
        res.status(400).json({ error: getServerMessage('CROP_REC_REQUIRED', lang) });
        return;
      }

      const result = await generateCropRecommendations({
        location: location.trim().slice(0, 100),
        soilType: soilType.trim().slice(0, 60),
        soilPh: typeof soilPh === 'string' ? soilPh.trim().slice(0, 20) : '',
        temperatureC: String(temperatureC ?? '28').slice(0, 20),
        rainfallMm: String(rainfallMm ?? '100').slice(0, 20),
        waterAvailability: waterAvailability.trim().slice(0, 60),
        season: season.trim().slice(0, 40),
        isSimulatedData: Boolean(isSimulatedData),
        language: lang,
      });

      const topCrops = result.recommendations.map((r) => r.cropName).slice(0, 3).join(', ');
      addActivity(
        req.farmer!.id,
        'crop_recommendation',
        `${season} · ${soilType}`,
        `${topCrops || 'OK'}`
      );

      res.json({ result });
    } catch (err) {
      if (err instanceof GeminiServiceError) {
        res.status(err.status).json({ error: err.message, code: err.code, detail: err.detail });
        return;
      }
      res.status(500).json({ error: getServerMessage('CROP_REC_UNEXPECTED', lang) });
    }
  });

  // Ensure unknown /api/* routes and malformed JSON payloads return structured JSON instead of HTML
  app.use('/api', (req, res) => {
    const lang = getRequestLanguage(req);
    res.status(404).json({ error: getServerMessage('API_NOT_FOUND', lang) });
  });

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith('/api')) {
      next(err);
      return;
    }
    const lang = getRequestLanguage(req);
    if (err instanceof SyntaxError && 'body' in err) {
      res.status(400).json({ error: getServerMessage('BAD_JSON', lang), code: 'BAD_JSON' });
      return;
    }
    const msg = err instanceof Error ? err.message : 'Internal server error';
    console.error(`[CropShield API Error] ${req.method} ${req.path}:`, msg);
    res.status(500).json({ error: msg, code: 'INTERNAL_ERROR' });
  });

  // --- Vite Dev Middleware or Production Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CropShield AI server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CropShield AI server:', err);
  process.exit(1);
});

const API_CONFIG = {
  // VinBus Bus Tracking API
  VBUS_BASE_URL: 'https://vbcore-api.vinbus.vn',
  VBUS_TRACKING_ENDPOINT: '/v1/client/public/bus_data/compress_data_by_time',
  VBUS_AUTH_KEY: 'ViNbUs2@2lElectricDtPZG+ulbseO1WGN',
  VBUS_ZIP_PASSWORD: 'v!n#bUS@2023',

  // GreenSM (Xanh SM) API
  GSM_BASE_URL: 'https://api.gsm-api.net',
  GSM_TRACKING_API_KEY: 'VSve2734sdfaxTj1SEscrsRepxCzhsrgS4JHEqMJllJF71rjCFtM0T5F1at83bwmI1eSwspEc',
  GSM_TRACKING_ENDPOINT: '/broadcasting/v1/public/location/',
  GSM_ROUTE_ENDPOINT: '/maps/v1/public/route/calculate',

  // iHanoi Traffic Camera API (CDS Hanoi)
  HANOI_CDS_BASE_URL: 'https://cds.hanoi.gov.vn/api/1.0/public/video-wall-cameras-v2',
  HANOI_API_BASE: 'https://cds.hanoi.gov.vn',
  HANOI_API_GET_CAMERA: '/api/cms_api/getCamera?',
  HANOI_API_VIDEO_DATA: '/api/VideoDataMapDownload?',
  HANOI_API_PLAYBACK: '/api/playback/timeline/',
  HANOI_API_SITES: '/api/cms_api/sites?',
  HANOI_API_LOGIN: '/api/login?',
  HANOI_API_PTZ_GET_POSITION: '/api/ptz/getPosition?',
  HANOI_API_PTZ_GOTO_HOME: '/api/ptz/goToHome?',
  HANOI_API_PTZ_MOVE: '/api/ptz/movePTZ?',
  HANOI_API_RECAPTCHA: '/api/reCaptcha?',

  // iHanoi App Super App API
  IHANOI_BASE_URL: 'https://ihanoi-api.gapo.vn/',
  IHANOI_MESSENGER_URL: 'https://ihanoi-messenger.gapo.vn/',
  IHANOI_UPLOAD_URL: 'https://ihanoi-upload.gapo.vn/',
};

const REGIONS = [
  { code: 'hn', label: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { code: 'hcm', label: 'TP. Hồ Chí Minh', lat: 10.78, lng: 106.70 },
];

const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  tertiary: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',
  dark: '#1C1C1E',
  light: '#F2F2F7',
  gray: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
};

const CONGESTION_COLORS = {
  1: { color: '#34C759', label: 'Thông thoáng' },
  2: { color: '#FF9500', label: 'Ùn nhẹ' },
  3: { color: '#FF3B30', label: 'Ùn nặng' },
  4: { color: '#AF52DE', label: 'Ùn tắc' },
};

const REFRESH_INTERVALS = {
  fast: 5000,
  normal: 15000,
  slow: 30000,
};

class VinBusAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000;
  }

  // ============ BUS TRACKING (VinBus) ============
  async getBusData(regionCode = 'hn') {
    const time = Math.floor(Date.now() / 1000);
    const url = `${API_CONFIG.VBUS_BASE_URL}${API_CONFIG.VBUS_TRACKING_ENDPOINT}?regionCode=${regionCode}&time=${time}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'client-version': 'android|690',
        'device-id': 'web-' + Date.now(),
        'language': 'en',
        'auth-key': API_CONFIG.VBUS_AUTH_KEY,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getCachedBusData(regionCode = 'hn') {
    const cacheKey = 'bus_' + regionCode;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await this.getBusData(regionCode);
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  async getBusLocation(driverId) {
    const url = `${API_CONFIG.GSM_BASE_URL}${API_CONFIG.GSM_TRACKING_ENDPOINT}${driverId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': API_CONFIG.GSM_TRACKING_API_KEY,
        'x-device-id': 'web-' + Date.now(),
        'x-request-id': 'req-' + Date.now(),
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getRouteWithTraffic(start, end) {
    const url = `${API_CONFIG.GSM_BASE_URL}${API_CONFIG.GSM_ROUTE_ENDPOINT}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_CONFIG.GSM_TRACKING_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        start: start,
        end: end,
        language: 'vi',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  // ============ HANOI TRAFFIC CAMERA API ============
  async getHanoiCameras() {
    const url = `${API_CONFIG.HANOI_CDS_BASE_URL}?page=1&refresh=0`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getHanoiCamerasPage(page) {
    const url = `${API_CONFIG.HANOI_CDS_BASE_URL}?page=${page}&refresh=0`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getHanoiCameraDetail(cameraId) {
    const url = `${API_CONFIG.HANOI_API_BASE}${API_CONFIG.HANOI_API_GET_CAMERA}&camera_id=${cameraId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getHanoiVideoData() {
    const url = `${API_CONFIG.HANOI_API_BASE}${API_CONFIG.HANOI_API_VIDEO_DATA}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getHanoiCameraSites() {
    const url = `${API_CONFIG.HANOI_API_BASE}${API_CONFIG.HANOI_API_SITES}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }

  // ============ TRAFFIC PREDICTION & REPORT ============
  predictTrafficDensity(speed) {
    if (speed === undefined || speed === null) return { level: 2, label: 'Không rõ', color: '#8E8E93' };
    if (speed > 40) return CONGESTION_COLORS[1];
    if (speed > 20) return CONGESTION_COLORS[2];
    if (speed > 10) return CONGESTION_COLORS[3];
    return CONGESTION_COLORS[4];
  }

  predictETA(distanceMeters, speedKmh, congestionLevel = 2) {
    if (!distanceMeters || !speedKmh || speedKmh <= 0) return null;
    const congestionMultiplier = [1.0, 1.3, 1.7, 2.0][congestionLevel] || 1.0;
    const baseTimeSeconds = (distanceMeters / 1000) / speedKmh * 3600;
    const adjustedSeconds = baseTimeSeconds * congestionMultiplier;
    return Math.round(adjustedSeconds / 60);
  }

  // Report traffic issue (for future backend integration)
  async submitTrafficReport(reportData) {
    // This endpoint would be used when VinBus/GreensM adds a reporting API
    // For now, store locally
    const report = {
      id: 'report_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...reportData,
      status: 'pending',
    };

    const existing = JSON.parse(localStorage.getItem('vinbus_reports') || '[]');
    existing.push(report);
    localStorage.setItem('vinbus_reports', JSON.stringify(existing));

    return report;
  }

  getStoredReports() {
    return JSON.parse(localStorage.getItem('vinbus_reports') || '[]');
  }
}

export const api = new VinBusAPI();
export { REGIONS, COLORS, CONGESTION_COLORS, REFRESH_INTERVALS };
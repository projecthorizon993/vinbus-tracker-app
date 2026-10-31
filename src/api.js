const API_CONFIG = {
  VBUS_BASE_URL: 'https://vbcore-api.vinbus.vn',
  VBUS_TRACKING_ENDPOINT: '/v1/client/public/bus_data/compress_data_by_time',
  VBUS_AUTH_KEY: 'ViNbUs2@2lElectricDtPZG+ulbseO1WGN',
  GSM_BASE_URL: 'https://api.gsm-api.net',
  GSM_TRACKING_API_KEY: 'VSve2734sdfaxTj1SEscrsRepxCzhsrgS4JHEqMJllJF71rjCFtM0T5F1at83bwmI1eSwspEc',
  GSM_TRACKING_ENDPOINT: '/broadcasting/v1/public/location/',
  GSM_ROUTE_ENDPOINT: '/maps/v1/public/route/calculate',
};

const REGIONS = [
  { code: 'hn', label: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { code: 'hcm', label: 'TP. Hồ Chí Minh', lat: 10.78, lng: 106.70 },
];

class VinBusAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000;
  }

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
}

export const api = new VinBusAPI();
export { REGIONS };
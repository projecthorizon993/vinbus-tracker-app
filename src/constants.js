export const API_CONFIG = {
  VBUS_BASE_URL: 'https://vbcore-api.vinbus.vn',
  VBUS_TRACKING_ENDPOINT: '/v1/client/public/bus_data/compress_data_by_time',
  VBUS_AUTH_KEY: 'ViNbUs2@2lElectricDtPZG+ulbseO1WGN',
  VBUS_ZIP_PASSWORD: 'v!n#bUS@2023',
  GSM_BASE_URL: 'https://api.gsm-api.net',
  GSM_TRACKING_API_KEY: 'VSve2734sdfaxTj1SEscrsRepxCzhsrgS4JHEqMJllJF71rjCFtM0T5F1at83bwmI1eSwspEc',
  GSM_TRACKING_ENDPOINT: '/broadcasting/v1/public/location/',
  GSM_ROUTE_ENDPOINT: '/maps/v1/public/route/calculate',
};

export const REGIONS = [
  { code: 'hn', label: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { code: 'hcm', label: 'TP. Hồ Chí Minh', lat: 10.78, lng: 106.70 },
];

export const COLORS = {
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

export const CONGESTION_COLORS = {
  1: { color: '#34C759', label: 'Thông thoáng' },
  2: { color: '#FF9500', label: 'Ùn nhẹ' },
  3: { color: '#FF3B30', label: 'Ùn nặng' },
  4: { color: '#AF52DE', label: 'Ùn tắc' },
};

export const REFRESH_INTERVALS = {
  fast: 5000,
  normal: 15000,
  slow: 30000,
};
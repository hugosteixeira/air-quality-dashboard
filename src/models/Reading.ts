export interface Reading {
  device_id: string;
  ts: string;
  type: string;
  co2?: number;
  hm?: number;
  pm1?: number;
  pm10_aqicn?: number;
  pm10_aqius?: number;
  pm10_conc?: number;
  pm25_aqicn?: number;
  pm25_aqius?: number;
  pm25_conc?: number;
  pr?: number;
  tp?: number;
}

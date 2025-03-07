import axios from 'axios';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';

console.log('Environment Variables:', process.env); // Add this line to log all environment variables
const API_BASE_URL = "https://air-quality-api-zlqt.onrender.com/"; // Change this line to use the correct API base URL

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/devices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw new Error('Failed to fetch devices');
  }
};

export const fetchReadings = async (filters: { reading_type?: string; deviceId?: string; start_ts?: string; end_ts?: string; skip?: number; limit?: number } = {}): Promise<{ readings: Reading[], total: number }> => {
  try {
    const { reading_type, deviceId, start_ts, end_ts, skip, limit } = filters;
    const params: { [key: string]: string | number } = {};

    if (reading_type) params.reading_type = reading_type;
    if (deviceId) params.device_id = deviceId;
    if (start_ts) params.start_ts = start_ts;
    if (end_ts) params.end_ts = end_ts;
    if (skip !== undefined) params.skip = skip;
    if (limit !== undefined) params.limit = limit; 

    console.log('Fetch Readings Params:', params); // Log the parameters used for fetching readings
    const response = await axios.get(`${API_BASE_URL}/readings`, { params });
    console.log('Responde data', response.data); // Log the response data to inspect the structure
    return { readings: response.data.readings, total: response.data.total_count };
  } catch (error) {
    console.error('Error fetching readings:', error);
    throw new Error('Failed to fetch readings');
  }
};

export const fetchLatestInstantReadings = async (deviceId: string): Promise<Reading> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/readings/latest`, {
      params: { device_id: deviceId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest instant readings:', error);
    throw new Error('Failed to fetch latest instant readings');
  }
};

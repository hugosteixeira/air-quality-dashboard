import axios from 'axios';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';

console.log('Environment Variables:', process.env);
const API_BASE_URL = "https://air-quality-api-zlqt.onrender.com";

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    const url = `${API_BASE_URL}/devices`;
    console.log('Fetching devices from URL:', url); // Log the URL
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw new Error('Failed to fetch devices');
  }
};

export const fetchReadings = async (filters: { reading_type?: string; deviceIds?: string[]; start_ts?: string; end_ts?: string; skip?: number; limit?: number } = {}): Promise<{ readings: Reading[], total: number }> => {
  try {
    const { reading_type, deviceIds, start_ts, end_ts, skip, limit } = filters;
    const url = `${API_BASE_URL}/readings`;
    const body: { [key: string]: any } = {};

    if (reading_type) body.reading_type = reading_type;
    if (deviceIds && deviceIds.length > 0) body.device_ids = deviceIds; // Pass device_ids in the body
    if (start_ts) body.start_ts = start_ts;
    if (end_ts) body.end_ts = end_ts;
    if (skip !== undefined) body.skip = skip;
    body.limit = limit !== undefined ? limit : 0; // Ensure limit is set to 0 if not provided

    console.log('Fetching readings from URL:', url, 'with body:', body); // Log the URL and body
    const response = await axios.post(url, body); // Use POST request with body
    console.log('Fetched Readings:', response.data);
    return { readings: response.data.readings, total: response.data.total_count };
  } catch (error) {
    console.error('Error fetching readings:', error);
    throw new Error('Failed to fetch readings');
  }
};

export const fetchLatestInstantReadings = async (deviceIds: string[]): Promise<Reading[]> => {
  try {
    const url = `${API_BASE_URL}/readings/latest`;
    const body = { device_ids: deviceIds }; // Pass device_ids in the body
    console.log('Fetching latest instant readings from URL:', url, 'with body:', body); // Log the URL and body
    const response = await axios.post(url, body); // Use POST request with body
    console.log('Fetched Latest Instant Readings:', response.data); // Log the response data
    return response.data;
  } catch (error) {
    console.error('Error fetching latest instant readings:', error);
    throw new Error('Failed to fetch latest instant readings');
  }
};

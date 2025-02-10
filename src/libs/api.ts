import axios from 'axios';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';

console.log('Environment Variables:', process.env); // Add this line to log all environment variables
const API_BASE_URL = "//localhost";

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    console.log('API_BASE_URL:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}:8000/devices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw new Error('Failed to fetch devices');
  }
};

export const fetchReadings = async (filters: { reading_type?: string; deviceId?: string; deviceIds?: string[]; startTime?: string; endTime?: string } = {}): Promise<Reading[]> => {
  try {
    const { reading_type, deviceId, deviceIds, startTime, endTime } = filters;
    const params: { [key: string]: string } = {};

    if (reading_type) params.reading_type = reading_type;
    if (deviceId) params.device_id = deviceId;
    if (deviceIds) params.device_ids = deviceIds.join(',');
    if (startTime) params.start_time = startTime;
    if (endTime) params.end_time = endTime;

    console.log('Fetch Readings Params:', params); // Log the parameters used for fetching readings
    const response = await axios.get(`${API_BASE_URL}:8000/readings`, { params });
    console.log('alow', response.data); // Log the response data to inspect the structure
    return response.data;
  } catch (error) {
    console.error('Error fetching readings:', error);
    throw new Error('Failed to fetch readings');
  }
};

export const fetchLatestInstantReadings = async (deviceId: string): Promise<Reading> => {
  try {
    const response = await axios.get(`${API_BASE_URL}:8000/readings/latest`, {
      params: { device_id: deviceId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest instant readings:', error);
    throw new Error('Failed to fetch latest instant readings');
  }
};

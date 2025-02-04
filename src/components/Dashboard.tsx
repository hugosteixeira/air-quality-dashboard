"use client";

import React, { useEffect, useState } from 'react';
import { fetchDevices, fetchLatestInstantReadings } from '../libs/api';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';
import DeviceTable from './DeviceTable';
import { Input, Typography } from 'antd';
import '../styles/globals.css';

const { Search } = Input;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [readings, setReadings] = useState<{ [key: string]: Reading }>({});
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
        setFilteredDevices(devicesData);

        const readingsData = await Promise.all(
          devicesData.map(device => fetchLatestInstantReadings(device.id))
        );

        const readingsMap = readingsData.reduce((acc, reading) => {
          acc[reading.device_id] = reading;
          return acc;
        }, {} as { [key: string]: Reading });

        setReadings(readingsMap);
        console.log('Readings Data:', readingsMap); // Log the readings data to inspect the structure
      } catch (err) {
        setError(err.message);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    setFilteredDevices(
      devices.filter(device =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, devices]);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <Title level={2}>Dispositivos</Title>
      <Search
        placeholder="Pesquisar"
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16, width: 200, float: 'right' }}
      />
      <DeviceTable devices={filteredDevices} readings={readings} />
    </div>
  );
};

export default Dashboard;

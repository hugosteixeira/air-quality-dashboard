"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchDevices, fetchLatestInstantReadings } from '../../libs/api';
import { Device } from '../../models/Device';
import { Reading } from '../../models/Reading';

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

const MapPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [readings, setReadings] = useState<{ [key: string]: Reading }>({});

  useEffect(() => {
    const fetchData = async () => {
      const devicesData = await fetchDevices();
      setDevices(devicesData);

      const readingsData = await Promise.all(
        devicesData.map(device => fetchLatestInstantReadings(device.id))
      );

      const readingsMap = readingsData.reduce((acc, reading) => {
        acc[reading.device_id] = reading;
        return acc;
      }, {} as { [key: string]: Reading });

      setReadings(readingsMap);
    };

    fetchData();
  }, []);

  return (
    <div style={{ flex: 1, height: '100vh' }}>
      <MapComponent devices={devices} readings={readings} />
    </div>
  );
};

export default MapPage;

"use client";

import React, { useEffect, useState } from 'react';
import { fetchDevices, fetchLatestInstantReadings } from '../libs/api';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';
import { Input, Typography } from 'antd';
import Link from 'next/link';
import '../styles/globals.css';
import { getTranslation } from '../utils/i18n'; // Import translation utility

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
          devicesData.map(device => fetchLatestInstantReadings([device.id]))
        );

        const readingsMap = readingsData.reduce((acc, readingArray) => {
          const latestReading = readingArray[0]; // Assuming the first element is the latest reading
          if (latestReading) {
            acc[latestReading.device_id] = latestReading;
          }
          return acc;
        }, {} as { [key: string]: Reading });

        setReadings(readingsMap);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return <div>{getTranslation('error')}: {error}</div>;
  }

  return (
    <div
      className="flex flex-col gap-8 items-center w-full"
      style={{
        minHeight: '100vh',
        padding: '16px',
        maxWidth: '1200px', // Restrict content width
        margin: '0 auto', // Center content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Title level={2} style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
        {getTranslation('devices')}
      </Title>
      <div className="w-full flex justify-end">
        <Search
          placeholder={getTranslation('search')}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16, width: '100%', maxWidth: '300px' }}
        />
      </div>
      <div
        className="grid gap-6 w-full"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        }}
      >
        {filteredDevices.map(device => (
          <Link key={device.id} href={`/device/${device.id}`} passHref>
            <div
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              style={{
                height: '200px', // Fixed card height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <h3 className="text-lg font-semibold">{device.name}</h3>
              <p className="text-sm text-gray-500">
                {getTranslation('co2')}: {readings[device.id]?.co2 ?? getTranslation('not_available')} ppm
              </p>
              <p className="text-sm text-gray-500">
                {getTranslation('humidity')}: {readings[device.id]?.hm ?? getTranslation('not_available')}%
              </p>
              <p className="text-sm text-gray-500">
                {getTranslation('temperature')}: {readings[device.id]?.tp ?? getTranslation('not_available')}°C
              </p>
              <p className="text-sm text-gray-500">
                {getTranslation('reading_date')}: {readings[device.id]?.ts ? formatDate(readings[device.id].ts) : getTranslation('not_available')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

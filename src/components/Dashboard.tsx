"use client";

import React, { useEffect, useState } from 'react';
import { fetchDevices, fetchLatestInstantReadings } from '../libs/api';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';
import { Input, Typography } from 'antd';
import Link from 'next/link';
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
    return <div>Erro: {error}</div>;
  }

  return (
    <div
      className="flex flex-col gap-8 items-center sm:items-center flex-1 w-full"
      style={{ maxWidth: '1200px', minHeight: '100vh', display: 'flex' }} // Certifique-se de que o display seja flex
    >
      <Title level={2}>Dispositivos</Title>
      <div className="w-full flex justify-end">
        <Search
          placeholder="Pesquisar"
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 16, width: '100%', maxWidth: 200 }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredDevices.map(device => (
          <Link key={device.id} href={`/device/${device.id}`} passHref>
            <div
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{device.name}</h3>
              <p className="text-sm text-gray-500">
                CO₂: {readings[device.id]?.co2 ?? 'N/A'} ppm
              </p>
              <p className="text-sm text-gray-500">
                Umidade: {readings[device.id]?.hm ?? 'N/A'}%
              </p>
              <p className="text-sm text-gray-500">
                Temperatura: {readings[device.id]?.tp ?? 'N/A'}°C
              </p>
              <p className="text-sm text-gray-500">
                Data da Leitura: {readings[device.id]?.ts ? formatDate(readings[device.id].ts) : 'N/A'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

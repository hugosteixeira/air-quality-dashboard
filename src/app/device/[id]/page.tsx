"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchReadings } from '../../../libs/api';
import { Reading } from '../../../models/Reading';
import { Table, Select, Typography } from 'antd';
import '../../../styles/globals.css';

const { Option } = Select;
const { Title } = Typography;

const DeviceDetails: React.FC = () => {
  const { id } = useParams();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [filteredReadings, setFilteredReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('instant');

  useEffect(() => {
    if (id) {
      const getData = async () => {
        try {
          const readingsData = await fetchReadings({ deviceId: id, reading_type: filter });
          console.log('Fetched Readings:', readingsData); // Log fetched readings data
          setReadings(readingsData);
          setFilteredReadings(readingsData);
        } catch (err) {
          setError(err.message);
        }
      };

      getData();
    }
  }, [id, filter]);

  useEffect(() => {
    console.log('Filter:', filter); // Log filter value
    console.log('Readings:', readings); // Log readings data
    if (filter) {
      setFilteredReadings(readings.filter(reading => reading.reading_type && reading.reading_type.toLowerCase() === filter.toLowerCase()));
    } else {
      setFilteredReadings(readings);
    }
  }, [filter, readings]);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const columns = [
    {
      title: 'Data e Hora',
      dataIndex: 'ts',
      key: 'ts',
      render: (text: string) => new Date(text).toLocaleString('pt-BR'),
    },
    {
      title: <span>CO₂ <span className="table-unit">(ppm)</span></span>,
      dataIndex: 'co2',
      key: 'co2',
    },
    {
      title: <span>Umidade <span className="table-unit">(%)</span></span>,
      dataIndex: 'hm',
      key: 'hm',
    },
    {
      title: <span>PM1 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm1',
      key: 'pm1',
    },
    {
      title: <span>PM10 AQICN <span className="table-unit"></span></span>,
      dataIndex: 'pm10_aqicn',
      key: 'pm10_aqicn',
    },
    {
      title: <span>PM10 AQIUS <span className="table-unit"></span></span>,
      dataIndex: 'pm10_aqius',
      key: 'pm10_aqius',
    },
    {
      title: <span>PM10 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm10_conc',
      key: 'pm10_conc',
    },
    {
      title: <span>PM25 AQICN <span className="table-unit"></span></span>,
      dataIndex: 'pm25_aqicn',
      key: 'pm25_aqicn',
    },
    {
      title: <span>PM25 AQIUS <span className="table-unit"></span></span>,
      dataIndex: 'pm25_aqius',
      key: 'pm25_aqius',
    },
    {
      title: <span>PM25 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm25_conc',
      key: 'pm25_conc',
    },
    {
      title: <span>Pressão <span className="table-unit">(mb)</span></span>,
      dataIndex: 'pr',
      key: 'pr',
    },
    {
      title: <span>Temperatura <span className="table-unit">(°C)</span></span>,
      dataIndex: 'tp',
      key: 'tp',
    },
  ];

  return (
    <div className="flex flex-col gap-8 items-center sm:items-center flex-1">
      <Title level={2}>Dados do Dispositivo</Title>
      <Select
        placeholder="Filtrar por Tipo de Leitura"
        value={filter}
        onChange={(value) => setFilter(value)}
        style={{ width: 200, marginBottom: 16 }}
      >
        <Option value="instant">Minuto a Minuto</Option>
        <Option value="hourly">Horário</Option>
        <Option value="daily">Diário</Option>
      </Select>
      <Table
        dataSource={filteredReadings}
        columns={columns}
        rowKey="ts"
        size="small"
        pagination={false}
        style={{ width: '100%', maxWidth: '1200px' }}
      />
    </div>
  );
};

export default DeviceDetails;

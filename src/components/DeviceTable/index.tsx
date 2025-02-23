import React from 'react';
import { Device } from '../../models/Device';
import { Reading } from '../../models/Reading';
import Link from 'next/link';
import { Table } from 'antd';
import '../../styles/globals.css';

interface DeviceTableProps {
  devices: Device[];
  readings: { [key: string]: Reading };
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices, readings }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    {
      title: 'Dispositivos',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Device) => <Link href={`/device/${record.id}`}>{text}</Link>,
    },
    {
      title: <span>CO₂ <span className="table-unit">(ppm)</span></span>,
      dataIndex: 'co2',
      key: 'co2',
      render: (text: string, record: Device) => readings[record.id]?.co2 ?? 'N/A',
    },
    {
      title: <span>Umidade <span className="table-unit">(%)</span></span>,
      dataIndex: 'hm',
      key: 'hm',
      render: (text: string, record: Device) => readings[record.id]?.hm ?? 'N/A',
    },
    {
      title: <span>PM1 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm1',
      key: 'pm1',
      render: (text: string, record: Device) => readings[record.id]?.pm1 ?? 'N/A',
    },
    {
      title: <span>PM10 AQICN <span className="table-unit"></span></span>,
      dataIndex: 'pm10_aqicn',
      key: 'pm10_aqicn',
      render: (text: string, record: Device) => readings[record.id]?.pm10_aqicn ?? 'N/A',
    },
    {
      title: <span>PM10 AQIUS <span className="table-unit"></span></span>,
      dataIndex: 'pm10_aqius',
      key: 'pm10_aqius',
      render: (text: string, record: Device) => readings[record.id]?.pm10_aqius ?? 'N/A',
    },
    {
      title: <span>PM10 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm10_conc',
      key: 'pm10_conc',
      render: (text: string, record: Device) => readings[record.id]?.pm10_conc ?? 'N/A',
    },
    {
      title: <span>PM25 AQICN <span className="table-unit"></span></span>,
      dataIndex: 'pm25_aqicn',
      key: 'pm25_aqicn',
      render: (text: string, record: Device) => readings[record.id]?.pm25_aqicn ?? 'N/A',
    },
    {
      title: <span>PM25 AQIUS <span className="table-unit"></span></span>,
      dataIndex: 'pm25_aqius',
      key: 'pm25_aqius',
      render: (text: string, record: Device) => readings[record.id]?.pm25_aqius ?? 'N/A',
    },
    {
      title: <span>PM25 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm25_conc',
      key: 'pm25_conc',
      render: (text: string, record: Device) => readings[record.id]?.pm25_conc ?? 'N/A',
    },
    {
      title: <span>Pressão <span className="table-unit">(mb)</span></span>,
      dataIndex: 'pr',
      key: 'pr',
      render: (text: string, record: Device) => readings[record.id]?.pr ?? 'N/A',
    },
    {
      title: <span>Temperatura <span className="table-unit">(°C)</span></span>,
      dataIndex: 'tp',
      key: 'tp',
      render: (text: string, record: Device) => readings[record.id]?.tp ?? 'N/A',
    },
    {
      title: 'Data e Hora',
      dataIndex: 'ts',
      key: 'ts',
      render: (text: string, record: Device) => readings[record.id] ? formatDate(readings[record.id].ts) : 'N/A',
    },
  ];

  return (
    <Table
      dataSource={devices}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
    />
  );
};

export default DeviceTable;

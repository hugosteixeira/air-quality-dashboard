import React from 'react';
import { Device } from '../../models/Device';
import { Reading } from '../../models/Reading';
import Link from 'next/link';
import { Table } from 'antd';
import '../../styles/globals.css';
import { getTranslation } from '../../utils/i18n'; // Import translation utility

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
      title: getTranslation('devices'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Device) => <Link href={`/device/${record.id}`}>{text}</Link>,
    },
    {
      title: <span>{getTranslation('co2')} <span className="table-unit">(ppm)</span></span>,
      dataIndex: 'co2',
      key: 'co2',
      render: (text: string, record: Device) => readings[record.id]?.co2 ?? getTranslation('not_available'),
    },
    {
      title: <span>{getTranslation('humidity')} <span className="table-unit">(%)</span></span>,
      dataIndex: 'hm',
      key: 'hm',
      render: (text: string, record: Device) => readings[record.id]?.hm ?? getTranslation('not_available'),
    },
    {
      title: <span>PM1 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm1',
      key: 'pm1',
      render: (text: string, record: Device) => readings[record.id]?.pm1 ?? getTranslation('not_available'),
    },
    {
      title: <span>PM10 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm10_conc',
      key: 'pm10_conc',
      render: (text: string, record: Device) => readings[record.id]?.pm10_conc ?? getTranslation('not_available'),
    },
    {
      title: <span>PM25 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm25_conc',
      key: 'pm25_conc',
      render: (text: string, record: Device) => readings[record.id]?.pm25_conc ?? getTranslation('not_available'),
    },
    {
      title: <span>{getTranslation('pressure')} <span className="table-unit">(mb)</span></span>,
      dataIndex: 'pr',
      key: 'pr',
      render: (text: string, record: Device) => readings[record.id]?.pr ?? getTranslation('not_available'),
    },
    {
      title: <span>{getTranslation('temperature')} <span className="table-unit">(°C)</span></span>,
      dataIndex: 'tp',
      key: 'tp',
      render: (text: string, record: Device) => readings[record.id]?.tp ?? getTranslation('not_available'),
    },
    {
      title: getTranslation('reading_date'),
      dataIndex: 'ts',
      key: 'ts',
      render: (text: string, record: Device) => readings[record.id] ? formatDate(readings[record.id].ts) : getTranslation('not_available'),
    },
  ];

  return (
    <Table
      dataSource={devices}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
      scroll={{ x: 'max-content' }}
      style={{ width: '100%', maxWidth: '100%' }}
    />
  );
};

export default DeviceTable;

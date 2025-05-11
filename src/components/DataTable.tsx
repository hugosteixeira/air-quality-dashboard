import React from 'react';
import { Table } from 'antd';
import { Reading } from '../models/Reading';
import { getTranslation } from '../utils/i18n'; // Import translation utility

interface DataTableProps {
  data: Reading[];
  currentPage: number;
  totalReadings: number;
  onPageChange: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, currentPage, totalReadings, onPageChange }) => {
  const columns = [
    {
      title: getTranslation('date_time'),
      dataIndex: 'ts',
      key: 'ts',
      render: (text: string) => new Date(text).toLocaleString('pt-BR'),
    },
    {
      title: <span>{getTranslation('co2')} <span className="table-unit">(ppm)</span></span>,
      dataIndex: 'co2',
      key: 'co2',
    },
    {
      title: <span>{getTranslation('humidity')} <span className="table-unit">(%)</span></span>,
      dataIndex: 'hm',
      key: 'hm',
    },
    {
      title: <span>PM1 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm1',
      key: 'pm1',
    },
    {
      title: <span>PM10 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm10_conc',
      key: 'pm10_conc',
    },
    {
      title: <span>PM25 <span className="table-unit">(µg/m³)</span></span>,
      dataIndex: 'pm25_conc',
      key: 'pm25_conc',
    },
    {
      title: <span>{getTranslation('pressure')} <span className="table-unit">(mb)</span></span>,
      dataIndex: 'pr',
      key: 'pr',
    },
    {
      title: <span>{getTranslation('temperature')} <span className="table-unit">(°C)</span></span>,
      dataIndex: 'tp',
      key: 'tp',
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="ts"
      size="small"
      pagination={{
        current: currentPage,
        pageSize: 10,
        total: totalReadings,
        onChange: onPageChange,
        showSizeChanger: false,
      }}
      scroll={{ x: 'max-content' }}
      style={{ width: '100%', maxWidth: '100%' }}
    />
  );
};

export default DataTable;

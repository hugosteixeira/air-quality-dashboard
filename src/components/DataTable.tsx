import React from 'react';
import { Table } from 'antd';
import { Reading } from '../models/Reading';

interface DataTableProps {
  data: Reading[];
  currentPage: number;
  totalReadings: number;
  onPageChange: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, currentPage, totalReadings, onPageChange }) => {
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
      style={{ width: '100%', maxWidth: '1200px' }}
    />
  );
};

export default DataTable;

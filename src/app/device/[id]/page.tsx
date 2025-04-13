"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchReadings } from '../../../libs/api';
import { Reading } from '../../../models/Reading';
import { Select, Typography, DatePicker, Tabs, ConfigProvider } from 'antd';
import DataTable from '../../../components/DataTable';
import GraphsTable from '../../../components/GraphsTable';
import { Dayjs } from 'dayjs';
import ptBR from 'antd/lib/locale/pt_BR';
import '../../../styles/globals.css';

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const DeviceDetails: React.FC = () => {
  const params = useParams() as { id: string }; // Tipagem explícita para garantir que `id` seja uma string
  const { id } = params;

  const [graphReadings, setGraphReadings] = useState<Reading[]>([]);
  const [tableReadings, setTableReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [graphFilter, setGraphFilter] = useState<string>('instant');
  const [tableFilter, setTableFilter] = useState<string>('instant');
  const [graphDateRange, setGraphDateRange] = useState<[string, string] | null>(null);
  const [tableDateRange, setTableDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalReadings, setTotalReadings] = useState<number>(0);

  const handleGraphDateChange = (dates: (Dayjs | null)[] | null, dateStrings: [string, string]) => {
    setGraphDateRange(dates && dates.length === 2 ? dateStrings : null);
  };

  const handleTableDateChange = (dates: (Dayjs | null)[] | null, dateStrings: [string, string]) => {
    setTableDateRange(dates && dates.length === 2 ? dateStrings : null);
  };

  const handleGraphFilterChange = (value: string) => {
    setGraphFilter(value);
  };

  const handleTableFilterChange = (value: string) => {
    setTableFilter(value);
  };

  const handleTableChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchGraphReadings = useCallback(async () => {
    if (id) {
      try {
        const { readings: readingsData } = await fetchReadings({
          deviceId: id,
          reading_type: graphFilter,
          start_ts: graphDateRange ? graphDateRange[0] : undefined,
          end_ts: graphDateRange ? graphDateRange[1] : undefined,
          limit: graphDateRange ? 0 : 30, // Limite de 30 inicialmente, sem limite ao selecionar datas
        });
        setGraphReadings(readingsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
  }, [id, graphFilter, graphDateRange]);

  const fetchTableReadings = useCallback(async () => {
    if (id) {
      try {
        const { readings: readingsData, total } = await fetchReadings({
          deviceId: id,
          reading_type: tableFilter,
          start_ts: tableDateRange ? tableDateRange[0] : undefined,
          end_ts: tableDateRange ? tableDateRange[1] : undefined,
          skip: ((currentPage || 1) - 1) * 10,
          limit: 10,
        });
        setTableReadings(readingsData);
        setTotalReadings(total);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
  }, [id, tableFilter, tableDateRange, currentPage]);

  useEffect(() => {
    fetchGraphReadings();
  }, [fetchGraphReadings]);

  useEffect(() => {
    fetchTableReadings();
  }, [fetchTableReadings]);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const tabItems = [
    {
      key: '1',
      label: 'Gráficos',
      children: (
        <>
          <div className="flex gap-4 justify-end w-full" style={{ width: '1200px' }}>
            <RangePicker
              onChange={handleGraphDateChange}
              style={{ marginBottom: 16 }}
              allowClear
            />
            <Select
              placeholder="Filtrar por Tipo de Leitura"
              value={graphFilter}
              onChange={handleGraphFilterChange}
              style={{ width: 200, marginBottom: 16 }}
            >
              <Option value="instant">Minuto a Minuto</Option>
              <Option value="hourly">Horário</Option>
              <Option value="daily">Diário</Option>
            </Select>
          </div>
          <GraphsTable data={graphReadings} readingType={graphFilter} />
        </>
      ),
    },
    {
      key: '2',
      label: 'Tabela de Dados',
      children: (
        <>
          <div className="flex gap-4 justify-end w-full" style={{ maxWidth: '1200px' }}>
            <RangePicker
              onChange={handleTableDateChange}
              style={{ marginBottom: 16 }}
              allowClear
            />
            <Select
              placeholder="Filtrar por Tipo de Leitura"
              value={tableFilter}
              onChange={handleTableFilterChange}
              style={{ width: 200, marginBottom: 16 }}
            >
              <Option value="instant">Minuto a Minuto</Option>
              <Option value="hourly">Horário</Option>
              <Option value="daily">Diário</Option>
            </Select>
          </div>
          <DataTable
            data={tableReadings}
            currentPage={currentPage}
            totalReadings={totalReadings}
            onPageChange={handleTableChange}
          />
        </>
      ),
    },
  ];

  return (
    <ConfigProvider locale={ptBR}>
      <div className="flex flex-col gap-8 items-center sm:items-center flex-1">
        <Title level={2}>Dados do Dispositivo</Title>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </div>
    </ConfigProvider>
  );
};

export default DeviceDetails;
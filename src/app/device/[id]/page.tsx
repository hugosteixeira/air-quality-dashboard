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
import { getTranslation } from '../../../utils/i18n'; // Import translation utility

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const DeviceDetails: React.FC = () => {
  const params = useParams() as { id: string };
  const { id } = params;

  const [graphReadings, setGraphReadings] = useState<Reading[]>([]);
  const [tableReadings, setTableReadings] = useState<Reading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [graphFilter, setGraphFilter] = useState<string>('instant');
  const [tableFilter] = useState<string>('instant');
  const [graphDateRange, setGraphDateRange] = useState<[string, string] | null>(null);
  const [tableDateRange] = useState<[string, string] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalReadings, setTotalReadings] = useState<number>(0);

  const handleGraphDateChange = (dates: (Dayjs | null)[] | null, dateStrings: [string, string]) => {
    setGraphDateRange(dates && dates.length === 2 ? dateStrings : null);
  };

  const handleGraphFilterChange = (value: string) => {
    setGraphFilter(value);
  };



  const handleTableChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchGraphReadings = useCallback(async () => {
    if (id) {
      try {
        const { readings: readingsData } = await fetchReadings({
          deviceIds: [id],
          reading_type: graphFilter,
          start_ts: graphDateRange ? graphDateRange[0] : undefined,
          end_ts: graphDateRange ? graphDateRange[1] : undefined,
          limit: graphDateRange ? 0 : 30,
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
          deviceIds: [id],
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
      label: getTranslation('graphs_tab'),
      children: (
        <>
          <div className="flex flex-wrap gap-4 justify-end w-full" style={{ maxWidth: '100%' }}>
            <RangePicker
              onChange={handleGraphDateChange}
              style={{ marginBottom: 16, width: '300px', maxWidth: '100%' }}
              allowClear
              placeholder={[
                getTranslation('start_date'),
                getTranslation('end_date'),
              ]}
            />
            <Select
              placeholder={getTranslation('filter_by_reading_type')}
              value={graphFilter}
              onChange={handleGraphFilterChange}
              style={{ width: '200px', maxWidth: '100%', marginBottom: 16 }}
            >
              <Option value="instant">{getTranslation('minute_by_minute')}</Option>
              <Option value="hourly">{getTranslation('hourly')}</Option>
              <Option value="daily">{getTranslation('daily')}</Option>
            </Select>
          </div>
          <GraphsTable data={graphReadings} readingType={graphFilter} />
        </>
      ),
    },
    {
      key: '2',
      label: getTranslation('data_table_tab'),
      children: (
        <div style={{ width: '100%', paddingBottom: '16px' }}>
          <div style={{ width: '100%', margin: '0 auto' }}>
            <DataTable
              data={tableReadings}
              currentPage={currentPage}
              totalReadings={totalReadings}
              onPageChange={handleTableChange}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider locale={ptBR}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
          {getTranslation('device_data')}
        </Title>
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
          style={{
            width: '100%',
            textAlign: 'center', // Center align the tabs' titles
          }}
          tabBarStyle={{
            justifyContent: 'center', // Ensure the tabs are centered
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default DeviceDetails;
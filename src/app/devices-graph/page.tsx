"use client";

import React, { useEffect, useState } from 'react';
import MultiLineGraph from '../../components/MultiLineGraph'; // Import the new MultiLineGraph component
import { Device } from '../../models/Device';
import { Reading } from '../../models/Reading';
import { fetchDevices, fetchReadings } from '../../libs/api';
import { DatePicker, Space, Select } from 'antd'; // Import Ant Design components
import dayjs from 'dayjs'; // Import dayjs for date formatting
import { getTranslation } from '../../utils/i18n'; // Update the path to the correct location

const { RangePicker } = DatePicker;
const { Option } = Select;

const DevicesGraphPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [readings, setReadings] = useState<{ [key: string]: Reading[] }>({});
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<keyof Reading>('co2');
  const [readingType, setReadingType] = useState<string>('hourly');

  // Set default date range to the last week
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>(() => {
    const endDate = dayjs().format('YYYY-MM-DD'); // Today
    const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD'); // 7 days ago
    return { startDate, endDate };
  });

  useEffect(() => {
    fetchDevices()
      .then((data) => {
        setDevices(data);
      })
      .catch((error) => console.error('Error fetching devices:', error));

    if (selectedDevices.length > 0) {
      fetchReadings({
        reading_type: readingType,
        limit: 0,
        deviceIds: selectedDevices, // Pass device_ids as a list
        start_ts: dateRange.startDate,
        end_ts: dateRange.endDate,
      })
        .then((data) => {
          const groupedReadings: { [key: string]: Reading[] } = {};
          data.readings.forEach((reading) => {
            if (!groupedReadings[reading.device_id]) {
              groupedReadings[reading.device_id] = [];
            }
            groupedReadings[reading.device_id].push(reading);
          });
          setReadings(groupedReadings);
        })
        .catch((error) => console.error('Error fetching readings:', error));
    }
  }, [readingType, dateRange, selectedDevices]); // Refetch readings when readingType, dateRange, or selectedDevices changes

  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null, dateStrings: [string, string]) => {
    if (dates) {
      setDateRange({
        startDate: dateStrings[0], // Use formatted date string
        endDate: dateStrings[1], // Use formatted date string
      });
    } else {
      setDateRange({ startDate: '', endDate: '' });
    }
  };

  const graphData = selectedDevices.map((deviceId) => ({
    deviceName: devices.find((device) => device.id === deviceId)?.name || `Device ${deviceId}`,
    data: readings[deviceId]?.map((reading) => ({
      timestamp: new Date(reading.ts).getTime(), // Convert timestamp to number
      value: parseFloat(
        (typeof reading[selectedProperty] === 'number'
          ? reading[selectedProperty]
          : parseFloat(reading[selectedProperty] as string) || 0
        ).toFixed(2) // Ensure value has at most 2 decimals
      ),
    })) || [], // Ensure data is specific to the device
  }));

  console.log('Graph Data:', graphData); // Debugging: Log graphData to ensure it's being prepared correctly

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        {getTranslation('graphs')}
      </h1>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {getTranslation('devices')}:
          </h3>
          <Select
            mode="multiple"
            placeholder={getTranslation('search')}
            value={selectedDevices}
            onChange={(values) => setSelectedDevices(values)}
            style={{ width: '100%' }} // Match height to the date picker
            allowClear
            maxTagCount={3}
          >
            {devices.map((device) => (
              <Option key={device.id} value={device.id}>
                {device.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {getTranslation('select_value')}:
          </h3>
          <Select
            value={selectedProperty}
            onChange={(value) => setSelectedProperty(value as keyof Reading)}
            style={{ width: '100%' }} // Match height to the date picker
          >
            <Option value="co2">{getTranslation('co2')} (ppm)</Option>
            <Option value="tp">{getTranslation('temperature')} (°C)</Option>
            <Option value="hm">{getTranslation('humidity')} (%)</Option>
            <Option value="pm1">PM1 (µg/m³)</Option>
            <Option value="pm10_conc">PM10 (µg/m³)</Option>
            <Option value="pm25_conc">PM25 (µg/m³)</Option>
          </Select>
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {getTranslation('filter_by_reading_type')}:
          </h3>
          <Select
            value={readingType}
            onChange={(value) => setReadingType(value)}
            style={{ width: '100%' }} // Match height to the date picker
          >
            <Option value="hourly">{getTranslation('hourly')}</Option>
            <Option value="daily">{getTranslation('daily')}</Option>
            <Option value="instant">{getTranslation('minute_by_minute')}</Option>
          </Select>
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            {getTranslation('date_time')}:
          </h3>
          <Space direction="vertical" size={12}>
            <RangePicker
              onChange={handleDateChange}
              defaultValue={[dayjs(dateRange.startDate), dayjs(dateRange.endDate)]} // Set default range to last week
            />
          </Space>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', height: '70vh' }}>
        {graphData.length > 0 ? (
          <MultiLineGraph
            data={graphData} // Pass multi-line data to the graph
            dataKey="value" // Key for the property value
            label={selectedProperty.toUpperCase()}
          />
        ) : (
          <p>{getTranslation('no_data')}</p>
        )}
      </div>
    </div >
  );
};

export default DevicesGraphPage;

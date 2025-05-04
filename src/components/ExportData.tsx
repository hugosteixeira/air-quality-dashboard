import React, { useState, useEffect } from 'react';
import { fetchDevices, fetchReadings } from '../libs/api';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';
import { Select, DatePicker, Button, Typography, ConfigProvider } from 'antd';
import { Dayjs } from 'dayjs';
import { Parser } from 'json2csv';
import ptBR from 'antd/lib/locale/pt_BR';
import '../styles/globals.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const ExportData: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
  const [readingType, setReadingType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [exportData, setExportData] = useState<Reading[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };

    getDevices();
  }, []);

  const handleDateChange = (dates: (Dayjs | null)[] | null, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const handleExport = async () => {
    try {
      const { readings } = await fetchReadings({
        deviceId: selectedDevice,
        reading_type: readingType,
        start_ts: dateRange ? dateRange[0] : undefined,
        end_ts: dateRange ? dateRange[1] : undefined,
        limit: 0,
      });
      setExportData(readings);
      exportToCSV(readings);
    } catch (error) {
      console.error('Failed to fetch readings:', error);
    }
  };

  const exportToCSV = (data: Reading[]) => {
    const fields = [
      'device_id',
      'ts',
      'reading_type',
      'co2',
      'hm',
      'pm1',
      'pm10_aqicn',
      'pm10_aqius',
      'pm10_conc',
      'pm25_aqicn',
      'pm25_aqius',
      'pm25_conc',
      'pr',
      'tp',
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'exported_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ConfigProvider locale={ptBR}>
      <div className="flex flex-col gap-8 items-center sm:items-center flex-1">
        <Title level={2}>Exportar Dados</Title>
        <div className="flex gap-4 justify-end w-full" style={{ maxWidth: '1200px' }}>
          <Select
            placeholder="Selecionar Dispositivo"
            onChange={setSelectedDevice}
            style={{ width: 200, marginBottom: 16 }}
          >
            {devices.map(device => (
              <Option key={device.id} value={device.id}>
                {device.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filtrar por Tipo de Leitura"
            onChange={setReadingType}
            style={{ width: 200, marginBottom: 16 }}
          >
            <Option value="instant">Minuto a Minuto</Option>
            <Option value="hourly">Horário</Option>
            <Option value="daily">Diário</Option>
          </Select>
          <RangePicker onChange={handleDateChange} style={{ marginBottom: 16 }} />
          <Button type="primary" onClick={handleExport} style={{ marginBottom: 16 }}>
            Exportar
          </Button>
        </div>
        {exportData.length > 0 && (
          <div>
            <p>Dados exportados com sucesso!</p>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ExportData;

import React from 'react';
import Graph from './Graph';
import { Reading } from '../models/Reading';
import { getTranslation } from '../utils/i18n'; // Import translation utility

interface GraphsTableProps {
  data: Reading[];
  readingType: string;
}

const GraphsTable: React.FC<GraphsTableProps> = ({ data, readingType }) => {
  return (
    <div
      className="graphs-table"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        width: '100%',
      }}
    >
      <Graph data={data} dataKey="pm1" label={`${getTranslation('pm1')} (µg/m³)`} readingType={readingType} />
      <Graph data={data} dataKey="pm10_conc" label={`${getTranslation('pm10')} (µg/m³)`} readingType={readingType} />
      <Graph data={data} dataKey="pm25_conc" label={`${getTranslation('pm25')} (µg/m³)`} readingType={readingType} />
      <Graph data={data} dataKey="co2" label={`${getTranslation('co2')} (ppm)`} readingType={readingType} />
      <Graph data={data} dataKey="tp" label={`${getTranslation('temperature')} (°C)`} readingType={readingType} />
      <Graph data={data} dataKey="hm" label={`${getTranslation('humidity')} (%)`} readingType={readingType} />
    </div>
  );
};

export default GraphsTable;

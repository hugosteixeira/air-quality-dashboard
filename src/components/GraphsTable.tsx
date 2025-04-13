import React from 'react';
import Graph from './Graph';
import { Reading } from '../models/Reading';

interface GraphsTableProps {
  data: Reading[];
  readingType: string;
}

const GraphsTable: React.FC<GraphsTableProps> = ({ data, readingType }) => {
  return (
    <div className="graphs-table" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <Graph data={data} dataKey="pm1" label="PM1 (µg/m³)" readingType={readingType} />
      <Graph data={data} dataKey="pm10_conc" label="PM10 (µg/m³)" readingType={readingType} />
      <Graph data={data} dataKey="pm25_conc" label="PM25 (µg/m³)" readingType={readingType} />
      <Graph data={data} dataKey="co2" label="CO₂ (ppm)" readingType={readingType} />
      <Graph data={data} dataKey="tp" label="Temperatura (°C)" readingType={readingType} />
      <Graph data={data} dataKey="hm" label="Umidade (%)" readingType={readingType} />
    </div>
  );
};

export default GraphsTable;

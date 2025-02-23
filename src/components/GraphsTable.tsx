import React from 'react';
import Graph from './Graph';
import { Reading } from '../models/Reading';

interface GraphsTableProps {
  data: Reading[];
  readingType: string;
}

const GraphsTable: React.FC<GraphsTableProps> = ({ data, readingType }) => {
  return (
    <div className="graphs-table">
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="pm1" label="PM1 (µg/m³)" readingType={readingType} />
        </div>
      </div>
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="pm10_conc" label="PM10 (µg/m³)" readingType={readingType} />
        </div>
      </div>
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="pm25_conc" label="PM25 (µg/m³)" readingType={readingType} />
        </div>
      </div>
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="co2" label="CO₂ (ppm)" readingType={readingType} />
        </div>
      </div>
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="tp" label="Temperatura (°C)" readingType={readingType} />
        </div>
      </div>
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="hm" label="Umidade (%)" readingType={readingType} />
        </div>
      </div>
      <div className="graphs-table-row">
        <div className="graphs-table-cell">
          <Graph data={data} dataKey="pr" label="Pressão (mb)" readingType={readingType} />
        </div>
      </div>
    </div>
  );
};

export default GraphsTable;

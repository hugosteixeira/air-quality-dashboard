import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GraphProps {
  data: any[];
  dataKey: string;
  label: string;
  readingType: string;
}

const Graph: React.FC<GraphProps> = ({ data, dataKey, label, readingType }) => {
  const dataWithUniqueKeys = data.map((item, index) => ({ ...item, uniqueKey: `${dataKey}-${index}` }));

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (readingType === 'daily') {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    } else {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const minValue = Math.min(...data.map(item => item[dataKey]));
  const maxValue = Math.max(...data.map(item => item[dataKey]));
  const avgValue = (data.reduce((sum, item) => sum + item[dataKey], 0) / data.length).toFixed(2);

  return (
    <div className="graph-card">
      <div className="graph-info">
        <p><strong>Propriedade:</strong> {label}</p>
        <p><strong>Mínimo:</strong> {minValue}</p>
        <p><strong>Máximo:</strong> {maxValue}</p>
        <p><strong>Média:</strong> {avgValue}</p>
      </div>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={dataWithUniqueKeys}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ts" tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip labelFormatter={formatTooltipLabel} />
            <Bar dataKey={dataKey} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;

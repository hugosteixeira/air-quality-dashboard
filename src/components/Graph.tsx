import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Reading } from '../models/Reading';

interface GraphProps {
  data: Reading[];
  dataKey: keyof Reading;
  label: string;
  readingType: string;
}

const Graph: React.FC<GraphProps> = ({ data, dataKey, label, readingType }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      const formattedData = data.map((item) => ({
        value: item[dataKey] ?? 0,
        timestamp: item.ts,
      }));

      const option = {
        title: {
          text: label,
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const { value, axisValue } = params[0];
            const date = new Date(axisValue);
            return `${date.toLocaleString('pt-BR')}<br/>Valor: ${value}`;
          },
        },
        xAxis: {
          type: 'category',
          data: formattedData.map((item) => item.timestamp),
          axisLabel: {
            formatter: (value: string) => {
              const date = new Date(value);
              return readingType === 'daily'
                ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            },
          },
        },
        yAxis: {
          type: 'value',
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            type: 'bar',
            data: formattedData.map((item) => item.value),
            itemStyle: {
              color: '#82ca9d',
            },
          },
        ],
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [data, dataKey, label, readingType]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default Graph;

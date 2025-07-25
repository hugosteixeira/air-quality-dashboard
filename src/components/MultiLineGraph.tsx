import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, CanvasRenderer, TitleComponent]);

interface MultiLineGraphProps {
  data: { deviceName: string; data: { timestamp: number; value: number }[] }[]; // Multi-line data
  dataKey: string;
  label: string;
}

const MultiLineGraph: React.FC<MultiLineGraphProps> = ({ data, dataKey, label }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      // Prepare series data for echarts
      const series = data.map((deviceData) => ({
        name: deviceData.deviceName,
        type: 'line',
        data: deviceData.data.map((point) => [point.timestamp, point.value]),
        smooth: true, // Smooth the lines
      }));

      // Calculate the min and max values for the Y-axis
      const allValues = data.flatMap((deviceData) => deviceData.data.map((point) => point.value));
      const minY = Math.min(...allValues);
      const maxY = Math.max(...allValues);

      // ECharts options
      const option = {
        title: {
          text: label,
          left: 'center',
          top: '16%', // Move title further down
          textAlign: 'center',
        },
        legend: {
          data: data.map((deviceData) => deviceData.deviceName),
          top: '22%', // Move legend further down to avoid overlap with title
        },
        grid: {
          top: '32%', // Move chart content lower
          bottom: '15%', // Leave space for the slider
        },
        xAxis: {
          type: 'time',
          name: 'Tempo',
          axisLabel: {
            formatter: (value: number) => new Date(value).toLocaleString('pt-BR'),
          },
        },
        yAxis: {
          type: 'value',
          name: label,
          min: minY - (maxY - minY) * 0.1, // Add padding to the Y-axis
          max: maxY + (maxY - minY) * 0.1, // Add padding to the Y-axis
        },
        dataZoom: [
          {
            type: 'slider', // Add slider for zooming and panning
            xAxisIndex: 0,
            top: '90%',
          },
          {
            type: 'inside', // Enable zooming and panning with mouse wheel
            xAxisIndex: 0,
          },
        ],
        series,
      };

      chart.setOption(option);

      const resizeObserver = new ResizeObserver(() => {
        chart.resize();
      });
      resizeObserver.observe(chartRef.current);

      return () => {
        resizeObserver.disconnect();
        chart.dispose();
      };
    }
  }, [data, dataKey, label]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        minHeight: '500px',
        height: '100%',
        paddingTop: '32px', // Valor mais razoável para não exagerar
        boxSizing: 'border-box',
        zIndex: 1, // Garante que fique acima do menu lateral
      }}
    >
      <div ref={chartRef} style={{ width: '100%', minHeight: '400px', height: '100%' }} />
    </div>
  );
};

export default MultiLineGraph;

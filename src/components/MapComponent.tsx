import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Map } from 'leaflet';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';
import { getTranslation } from '../utils/i18n'; // Import translation utility

interface MapComponentProps {
  devices: Device[];
  readings: { [key: string]: Reading };
}

const MapComponent: React.FC<MapComponentProps> = ({ devices, readings }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [selectedValue, setSelectedValue] = useState<'co2' | 'tp' | 'hm'>('co2');

  useEffect(() => {
    if (mapRef.current) {
      import('leaflet').then(L => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        const map = L.map(mapRef.current!).setView([-8.0476, -34.877], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        devices.forEach(device => {
          const reading = readings[device.id];
          const value = reading?.[selectedValue] ?? 'N/A';

          if (device.latitude && device.longitude) {
            const getTheme = (val: number | string) => {
              if (typeof val !== 'number') {
                return { background: 'gray', text: 'white' };
              }
              if (selectedValue === 'co2') {
                if (val <= 400) return { background: 'green', text: 'white' };
                if (val <= 1000) return { background: 'yellow', text: 'black' };
                return { background: 'red', text: 'white' };
              }
              return { background: 'blue', text: 'white' };
            };

            const { background, text } = getTheme(value);

            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  background-color: ${background};
                  color: ${text};
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: bold;
                  border: 2px solid white;
                ">
                  ${value}
                </div>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            });

            const dateTime = reading ? new Date(reading.ts).toLocaleString() : getTranslation('not_available');

            L.marker([device.latitude, device.longitude], { icon: customIcon }).addTo(map)
              .bindPopup(`
                <strong>${device.name}</strong><br />
                ${getTranslation(selectedValue)}: ${value}<br />
                <strong>${getTranslation('date_time')}:</strong> ${dateTime}
              `);
          }
        });

        mapInstanceRef.current = map;
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [devices, readings, selectedValue]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
        }}
      >
        <label htmlFor="value-select" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
          {getTranslation('select_value')}:
        </label>
        <select
          id="value-select"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value as 'co2' | 'tp' | 'hm')}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="co2">{getTranslation('co2')}</option>
          <option value="tp">{getTranslation('temperature')}</option>
          <option value="hm">{getTranslation('humidity')}</option>
        </select>
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;

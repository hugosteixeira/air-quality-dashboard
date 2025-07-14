import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { Map } from 'leaflet';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';
import { getTranslation } from '../utils/i18n'; // Import translation utility
import { Typography } from 'antd'; // Import Typography from Ant Design
const { Title } = Typography;

interface MapComponentProps {
  devices: Device[];
  readings: { [key: string]: Reading };
}

const WHO_COLORS = {
  co2: [
    { color: 'green', labelKey: 'co2_excellent' },
    { color: 'yellow', labelKey: 'co2_good' },
    { color: 'orange', labelKey: 'co2_moderate' },
    { color: 'red', labelKey: 'co2_poor' },
    { color: 'gray', labelKey: 'not_available' },
  ],
  tp: [
    { color: 'blue', labelKey: 'tp_cold' },
    { color: 'green', labelKey: 'tp_comfort' },
    { color: 'orange', labelKey: 'tp_warm' },
    { color: 'red', labelKey: 'tp_hot' },
    { color: 'gray', labelKey: 'not_available' },
  ],
  hm: [
    { color: 'red', labelKey: 'hm_dry' },
    { color: 'green', labelKey: 'hm_comfort' },
    { color: 'orange', labelKey: 'hm_humid' },
    { color: 'blue', labelKey: 'hm_too_humid' },
    { color: 'gray', labelKey: 'not_available' },
  ],
};

const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;

const MapComponent: React.FC<MapComponentProps> = ({ devices, readings }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [selectedValue, setSelectedValue] = useState<'co2' | 'tp' | 'hm'>('co2');
  const [showLegend, setShowLegend] = useState(isMobile ? false : true);
  const [showFilter, setShowFilter] = useState(isMobile ? false : true);

  // WHO-based theme function
  const getTheme = useCallback((val: number | string) => {
    if (typeof val !== 'number') {
      return { background: 'gray', text: 'white' };
    }
    if (selectedValue === 'co2') {
      if (val <= 400) return { background: 'green', text: 'white' };
      if (val <= 1000) return { background: 'yellow', text: 'black' };
      if (val <= 2000) return { background: 'orange', text: 'black' };
      return { background: 'red', text: 'white' };
    }
    if (selectedValue === 'tp') {
      if (val < 18) return { background: 'blue', text: 'white' };
      if (val <= 24) return { background: 'green', text: 'white' };
      if (val <= 29) return { background: 'orange', text: 'black' };
      return { background: 'red', text: 'white' };
    }
    if (selectedValue === 'hm') {
      if (val < 30) return { background: 'red', text: 'white' };
      if (val <= 60) return { background: 'green', text: 'white' };
      if (val <= 80) return { background: 'orange', text: 'black' };
      return { background: 'blue', text: 'white' };
    }
    return { background: 'gray', text: 'white' };
  }, [selectedValue]);

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
  }, [devices, readings, selectedValue, getTheme]);

  return (
    <div
      className="flex flex-col gap-8 items-center w-full"
      style={{
        minHeight: '100vh',
        padding: '16px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Make this container relative for absolute positioning inside
      }}
    >
      <Title level={2} style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
        {getTranslation('map')}
      </Title>

      {/* Map and floating boxes container */}
      <div
        style={{
          position: 'relative',
          width: '95vw',
          height: '80vh',
          minHeight: '500px',
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        {/* Mobile: Legend and Filter Buttons (stacked vertically, bottom right) */}
        {isMobile && (
          <div
            style={{
              position: 'absolute',
              right: '30px',
              bottom: '30px',
              zIndex: 1100,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px', // space between buttons
              alignItems: 'flex-end',
            }}
          >
            <button
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#1976d2',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                cursor: 'pointer',
              }}
              onClick={() => setShowLegend((v) => !v)}
            >
              {getTranslation('legend')}
            </button>
            <button
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#388e3c',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                cursor: 'pointer',
              }}
              onClick={() => setShowFilter((v) => !v)}
            >
              {getTranslation('filter')}
            </button>
          </div>
        )}

        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            flexGrow: 1,
            zIndex: 1,
          }}
        />
        {/* Desktop: align legend and filter horizontally at bottom right of map */}
        {
          !isMobile && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                margin: '20px',
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                zIndex: 1200,
                alignItems: 'flex-end',
                maxWidth: 'calc(100% - 40px)',
                overflow: 'visible',
              }}
            >
              {/* Legend Box */}
              {showLegend && (
                <div
                  style={{
                    minWidth: '220px',
                    maxWidth: 'min(260px, 40vw)',
                    background: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    fontSize: '13px',
                    height: 'auto',
                    alignSelf: 'flex-end', // align to bottom
                    overflow: 'auto',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                    {getTranslation(selectedValue)} {getTranslation('legend')}
                  </div>
                  {WHO_COLORS[selectedValue].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '18px',
                          height: '18px',
                          background: item.color,
                          borderRadius: '50%',
                          marginRight: '8px',
                          border: '1px solid #ccc',
                        }}
                      />
                      <span>{getTranslation(item.labelKey)}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Filter Box */}
              {showFilter && (
                <div
                  style={{
                    minWidth: '140px',
                    maxWidth: 'min(200px, 30vw)',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    height: 'auto',
                    alignSelf: 'flex-end', // align to bottom
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                  }}
                >
                  {isMobile && (
                    <button
                      onClick={() => setShowFilter(false)}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '8px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#888',
                        fontWeight: 'bold',
                      }}
                      aria-label={getTranslation('close')}
                    >
                      ×
                    </button>
                  )}
                  <label htmlFor="value-select" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                    {getTranslation('select_value')}:
                  </label>
                  <select
                    id="value-select"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value as 'co2' | 'tp' | 'hm')}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                  >
                    <option value="co2">{getTranslation('co2')}</option>
                    <option value="tp">{getTranslation('temperature')}</option>
                    <option value="hm">{getTranslation('humidity')}</option>
                  </select>
                </div>
              )}
            </div>
          )
        }

        {/* Mobile: floating boxes at bottom right of map */}
        {
          isMobile && showLegend && (
            <div
              style={{
                position: 'absolute',
                right: '30px',
                bottom: showFilter ? '90px' : '30px',
                minWidth: '220px',
                maxWidth: 'calc(95vw - 60px)',
                width: 'auto',
                background: 'white',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                zIndex: 1200,
                fontSize: '13px',
              }}
            >
              <button
                onClick={() => setShowLegend(false)}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '8px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#888',
                  fontWeight: 'bold',
                }}
                aria-label={getTranslation('close')}
              >
                ×
              </button>
              <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                {getTranslation(selectedValue)} {getTranslation('legend')}
              </div>
              {WHO_COLORS[selectedValue].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '18px',
                      height: '18px',
                      background: item.color,
                      borderRadius: '50%',
                      marginRight: '8px',
                      border: '1px solid #ccc',
                    }}
                  />
                  <span>{getTranslation(item.labelKey)}</span>
                </div>
              ))}
            </div>
          )
        }
        {
          isMobile && showFilter && (
            <div
              style={{
                position: 'absolute',
                right: '30px',
                bottom: '30px',
                minWidth: '140px',
                maxWidth: 'calc(95vw - 60px)',
                width: 'auto',
                background: 'white',
                padding: '8px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                zIndex: 1200,
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <button
                onClick={() => setShowFilter(false)}
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '8px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#888',
                  fontWeight: 'bold',
                }}
                aria-label={getTranslation('close')}
              >
                ×
              </button>
              <label htmlFor="value-select" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                {getTranslation('select_value')}:
              </label>
              <select
                id="value-select"
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value as 'co2' | 'tp' | 'hm')}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              >
                <option value="co2">{getTranslation('co2')}</option>
                <option value="tp">{getTranslation('temperature')}</option>
                <option value="hm">{getTranslation('humidity')}</option>
              </select>
            </div>
          )
        }
      </div>
    </div >
  );
};

export default MapComponent;

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Device } from '../models/Device';
import { Reading } from '../models/Reading';

interface MapComponentProps {
  devices: Device[];
  readings: { [key: string]: Reading }; // Mapeia o ID do dispositivo para sua última leitura
}

const MapComponent: React.FC<MapComponentProps> = ({ devices, readings }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Armazena a instância do mapa
  const [selectedValue, setSelectedValue] = useState<'co2' | 'tp' | 'hm'>('co2'); // Valor selecionado para exibição

  useEffect(() => {
    if (mapRef.current) {
      import('leaflet').then(L => {
        // Verifica se o mapa já foi inicializado
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove(); // Remove o mapa existente
        }

        // Inicializa o mapa
        const map = L.map(mapRef.current!).setView([-8.0476, -34.877], 12); // Centraliza em Recife
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Adiciona marcadores personalizados para cada dispositivo
        devices.forEach(device => {
          const reading = readings[device.id];
          const value = reading?.[selectedValue] ?? 'N/A'; // Valor selecionado ou 'N/A' se não houver leitura

          if (device.latitude && device.longitude) {
            // Define a cor do marcador e do texto com base no valor
            const getTheme = (val: number | string) => {
              if (typeof val !== 'number') {
                return { background: 'gray', text: 'white' }; // Cor padrão para valores inválidos
              }
              if (selectedValue === 'co2') {
                if (val <= 400) return { background: 'green', text: 'white' }; // Bom
                if (val <= 1000) return { background: 'yellow', text: 'black' }; // Moderado
                return { background: 'red', text: 'white' }; // Ruim
              }
              return { background: 'blue', text: 'white' }; // Padrão para outros valores
            };

            const { background, text } = getTheme(value);

            // Cria um ícone personalizado
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
              iconSize: [40, 40], // Tamanho do ícone
              iconAnchor: [20, 20], // Posição do ícone
            });

            // Adiciona o marcador ao mapa
            L.marker([device.latitude, device.longitude], { icon: customIcon }).addTo(map)
              .bindPopup(`
                <strong>${device.name}</strong><br />
                ${selectedValue.toUpperCase()}: ${value}
              `);
          }
        });

        // Armazena a instância do mapa
        mapInstanceRef.current = map;
      });
    }

    // Cleanup: Remove o mapa ao desmontar o componente
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [devices, readings, selectedValue]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Menu flutuante */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px', // Alterado de 'left' para 'right' para mover para o canto superior direito
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
        }}
      >
        <label htmlFor="value-select" style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
          Selecionar Valor:
        </label>
        <select
          id="value-select"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value as 'co2' | 'tp' | 'hm')}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="co2">CO₂</option>
          <option value="tp">Temperatura</option>
          <option value="hm">Umidade</option>
        </select>
      </div>

      {/* Mapa */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;

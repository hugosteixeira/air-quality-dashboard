import React, { useCallback } from 'react';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Reading } from '../models/Reading';
import { getTranslation } from '../utils/i18n'; // Import translation utility


interface DataTableProps {
  data: Reading[];
  currentPage: number;
  totalReadings: number;
  onPageChange: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, currentPage, totalReadings, onPageChange }) => {
  const rowsPerPage = 10;

  // Use useCallback to memoize the onPageChange handler
  const handlePageChange = useCallback(
    (e: PaginatorPageChangeEvent) => {
      if (e.page + 1 !== currentPage) {
        onPageChange(e.page + 1);
      }
    },
    [currentPage, onPageChange]
  );

  return (
    <div > {/* Add a custom container class */}
      <PrimeDataTable
        value={data}
        scrollable
        scrollHeight="flex"
      >
        <Column
          field="ts"
          header={getTranslation('date_time')}
          body={(rowData) => new Date(rowData.ts).toLocaleString('pt-BR')}
          style={{ textAlign: 'center' }} // Center align content
        />
        <Column field="co2" header={`${getTranslation('co2')} (ppm)`} style={{ textAlign: 'center' }} className="column-header-center" />
        <Column field="hm" header={`${getTranslation('humidity')} (%)`} style={{ textAlign: 'center' }} className="column-header-center" />
        <Column field="pm1" header="PM1 (µg/m³)" style={{ textAlign: 'center' }} className="column-header-center" />
        <Column field="pm10_conc" header="PM10 (µg/m³)" style={{ textAlign: 'center' }} className="column-header-center" />
        <Column field="pm25_conc" header="PM25 (µg/m³)" style={{ textAlign: 'center' }} className="column-header-center" />
        <Column field="pr" header={`${getTranslation('pressure')} (mb)`} style={{ textAlign: 'center' }} className="column-header-center" />
        <Column field="tp" header={`${getTranslation('temperature')} (°C)`} style={{ textAlign: 'center' }} className="column-header-center" />
      </PrimeDataTable>
      <Paginator
        first={(currentPage - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalReadings}
        onPageChange={handlePageChange} // Use the memoized handler
        template={{
          layout: 'PrevPageLink PageLinks NextPageLink ',
        }}
      />
    </div>
  );
};

export default DataTable;

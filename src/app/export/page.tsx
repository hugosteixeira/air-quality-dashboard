"use client";

import ExportData from "../../components/ExportData";

export default function ExportPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 items-center sm:items-center">
        <ExportData />
      </main>
    </div>
  );
}

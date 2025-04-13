"use client";

import ExportData from "../../components/ExportData";

export default function ExportPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 pb-20 sm:pb-20">
      <main className="flex flex-col gap-8 items-center sm:items-center w-full max-w-4xl">
        <ExportData />
      </main>
    </div>
  );
}

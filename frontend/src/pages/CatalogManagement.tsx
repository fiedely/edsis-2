import { LayoutGrid } from 'lucide-react';

export default function CatalogManagement() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <LayoutGrid className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Catalog Dashboard</h2>
      <p className="text-gray-500 max-w-sm mt-2">
        This module will allow users to organize saved views and manage display settings.
        <br/><br/>
        <span className="text-xs uppercase font-bold tracking-wider text-primary">Coming Soon</span>
      </p>
    </div>
  );
}
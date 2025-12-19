import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
// FIX: Added 'Wrench' to imports, removed unused ones
import { RefreshCw, Upload, FileSpreadsheet, Wrench } from 'lucide-react';
import { addBrand, addCategory, addCollectionToBrand } from '../services/masterData';
import { addProduct } from '../services/products';
import { generateSku, generateSearchKeywords } from '../lib/business-logic';
import type { Product } from '../types/inventory';
import { Timestamp } from 'firebase/firestore';

// Default Master Data
const INITIAL_DATA = {
  categories: ['Accessories - Kitchen', 'Accessories - Living', 'Armchair', 'Bed', 'Bench', 'Coffee Table', 'Console Table', 'Dining Chair', 'Dining Table', 'Floor Lamps', 'Kitchen', 'Kitchen Appliances', 'Ottoman', 'Portable Lamps', 'Sideboard', 'Sofa', 'Special Cabinet', 'Suspending Lamps', 'Table Lamps', 'Tableware', 'Vanity', 'Vase', 'Wall Lamps', 'Wardrobe'],
  brands: [
    { name: 'BLUESIDE', collections: ['Ambrosia', 'Anastasia', 'Bea', 'Bolina', 'Briki', 'Chino'] },
    { name: 'CALLISA', collections: ['Azur', 'Boho Orange', 'Diamonback'] },
    { name: 'ELEMENTI DOMUS', collections: ['Aviv', 'Bora', 'Cala'] },
    { name: 'GULLO', collections: ['Fiorentina', 'Gaggenau', 'Restart'] },
    { name: 'PIANCA', collections: ['Abaco', 'Fushimi', 'Nice'] },
    { name: 'SLAMP', collections: ['Aria', 'Clizia', 'Nuvem'] },
    { name: 'ZAFFERANO', collections: ['Bilia', 'Perle', 'Veneziano'] }
  ]
};

// FIX: Define a loose type for the raw Excel row
interface ExcelRow {
  [key: string]: any;
}

export default function AdminTools() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

  // --- 1. MASTER DATA SEEDER ---
  const handleSeedMaster = async () => {
    if (!window.confirm("Initialize Brands & Categories?")) return;
    setLoading(true);
    addLog("--- STARTED MASTER SEED ---");
    try {
      for (const cat of INITIAL_DATA.categories) {
        await addCategory(cat);
        addLog(`Added Category: ${cat}`);
      }
      for (const b of INITIAL_DATA.brands) {
        await addBrand(b.name);
        const bId = b.name.toLowerCase().replace(/\s+/g, '-');
        for (const c of b.collections) {
          await addCollectionToBrand(bId, c);
        }
        addLog(`Added Brand: ${b.name} with ${b.collections.length} collections`);
      }
      addLog("--- COMPLETED MASTER SEED ---");
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. EXCEL PRODUCT UPLOADER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    addLog(`Reading file: ${file.name}...`);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        
        // FIX: Cast the result to unknown first, then to our ExcelRow type
        const rawData = XLSX.utils.sheet_to_json(ws);
        const data = rawData as ExcelRow[];

        addLog(`Found ${data.length} rows. Processing...`);
        
        const RATE_EUR_IDR = 19000; 

        let count = 0;
        
        // FIX: Correct 'for...of' syntax without type annotation on the variable
        for (const row of data) {
          // MAP EXCEL COLUMNS TO PRODUCT
          const brand = row['brand'] || row['Brand'] || 'Unknown';
          const category = row['category'] || row['Category'] || 'Unknown';
          const collection = row['collection name'] || row['Collection'] || 'General';
          const name = row['product name'] || row['Product Name'] || 'Unnamed';
          
          if (brand === 'Unknown' || name === 'Unnamed') continue; 

          // Generate System Fields
          const sku = generateSku(brand, collection, category, name);
          const id = crypto.randomUUID();

          const newProduct: Product = {
            id,
            sku,
            brand: brand.toString(),
            category: category.toString(),
            collectionName: collection.toString(),
            productName: name.toString(),
            manufacturerId: row['manufacturer id'] || '',
            dimensions: row['dimensions'] || '',
            finishing: row['finishing'] || '',
            detail: row['detail'] || '',
            
            isNotForSale: !!row['not for sale'], 
            isUpcoming: !!row['upcoming'],
            
            totalQty: Number(row['total qty']) || 0,
            bookedQty: 0,
            location: row['location'] || 'Warehouse',
            
            priceEur: Number(row['retail price (eur)']) || 0,
            priceUsd: Number(row['retail price (usd)']) || 0,
            priceIdr: Number(row['retail price (eur)']) * RATE_EUR_IDR,
            
            discountIds: [],
            imageUrl: row['image file'] || '',
            searchKeywords: [],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };

          newProduct.searchKeywords = generateSearchKeywords(newProduct);

          await addProduct(newProduct);
          count++;
        }

        addLog(`--- SUCCESSFULLY IMPORTED ${count} PRODUCTS ---`);

      } catch (err: any) {
        addLog(`IMPORT ERROR: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-900 rounded-lg">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="h2">Admin Tools</h1>
          <p className="muted">System Maintenance & Data Imports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: MASTER DATA */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <RefreshCw className="w-5 h-5" />
            <h3 className="font-semibold">Master Data Initialization</h3>
          </div>
          <p className="text-sm text-gray-500">
            Resets and populates the database with the default list of 25 Categories and 7 Brands (Blueside, Gull, etc.).
          </p>
          <Button 
            onClick={handleSeedMaster} 
            isLoading={loading}
            variant="outline" 
            className="w-full"
          >
            Run Master Seed
          </Button>
        </Card>

        {/* CARD 2: EXCEL IMPORT */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-green-700">
            <FileSpreadsheet className="w-5 h-5" />
            <h3 className="font-semibold">Import Products from Excel</h3>
          </div>
          <p className="text-sm text-gray-500">
            Upload the standard Inventory .xlsx file. The system will auto-generate SKUs and convert prices (EUR → IDR).
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button 
              isLoading={loading}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              Select Excel File
            </Button>
          </div>
        </Card>

      </div>

      {/* CONSOLE LOG OUTPUT */}
      <Card className="bg-gray-900 text-green-400 font-mono text-xs p-4 h-64 overflow-y-auto rounded-lg shadow-inner">
        <div className="mb-2 text-gray-500 border-b border-gray-800 pb-1">SYSTEM LOGS</div>
        {logs.length === 0 && <span className="text-gray-700">Waiting for actions...</span>}
        {logs.map((log, i) => (
          <div key={i} className="mb-1">{`> ${log}`}</div>
        ))}
      </Card>

    </div>
  );
}
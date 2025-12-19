import { useState, useEffect } from 'react';
import { 
  Plus, RefreshCw, ChevronDown, ChevronRight 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
// NEW IMPORTS
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { 
  getBrands, addBrand, addCollectionToBrand, getCategories, addCategory 
} from '../services/masterData';
import type { Brand, Category } from '../types/inventory';
import { cn } from '../lib/utils';

// ... INITIAL_DATA constant remains exactly the same ...
const INITIAL_DATA = {
  categories: [
    'Accessories - Kitchen', 'Accessories - Living', 'Accessories - Night', 'Armchair', 
    'Bed', 'Bench', 'Coffee Table', 'Console Table', 'Dining Chair', 'Dining Table', 
    'Floor Lamps', 'Kitchen', 'Kitchen Appliances', 'Ottoman', 'Portable Lamps', 
    'Sideboard', 'Sofa', 'Special Cabinet', 'Suspending Lamps', 'Table Lamps', 
    'Tableware', 'Vanity', 'Vase', 'Wall Lamps', 'Wardrobe'
  ],
  brands: [
    { name: 'BLUESIDE', collections: ['Ambrosia', 'Anastasia', 'Bea', 'Bolina', 'Briki', 'Chino', 'Chàdi', 'Cino', 'Cucumber', 'Dotto', 'Duck', 'Elio', 'Emilio', 'Fred', 'Gino', 'Glenda', 'Ibridi', 'Margot', 'Modigliani', 'Mood', 'Nassa', 'Oscar', 'Ottavio', 'Phil', 'Philomena', 'Pilaf', 'Plustio', 'Pop', 'Sailor Baloon', 'Shot', 'Small Glasses', 'Sospiro', 'Suk', 'Tag', 'Tazzazen', 'Tears', 'Tulipano', 'Vasetti', 'Vento', 'Vinicio', 'Xeno', 'lvo'] },
    { name: 'CALLISA', collections: ['Azur', 'Boho Orange', 'Diamonback', 'Emerald Pattern', 'Etched Grid', 'Geo Line', 'Midnight Angular', 'Peachy Line', 'Pillow', 'Rhythmic Blocks', 'Tartan Twist', 'Verve'] },
    { name: 'ELEMENTI DOMUS', collections: ['Aviv', 'Bora', 'Cala', 'Coffee Table', 'Earth', 'Eila', 'Inizio', 'Isola', 'Libero', 'Mezzo', 'Mula', 'Water'] },
    { name: 'GULLO', collections: ['4 Copper Pan Set', 'Blast Chiller', 'Chopping Board', 'Cladding', 'Copper Jars', 'Countertop Tap', 'Fiorentina', 'Gaggenau', 'Knife Block', 'OGS', 'Professional Hood', 'Professional Knife Set', 'Restart', 'Shelf', 'Washbasin'] },
    { name: 'PIANCA', collections: ['Abaco', 'All-in', 'Anteprima & Island Up', 'Baio', 'Calatea', 'Chloe', 'Contralto', 'Contralto Valet', 'Cornice', 'Cubo', 'Delano Up', 'Domenica', 'Eden', 'Ella', 'Embrace', 'Emi', 'Esse', 'Ettore', 'Fushimi', 'Haik', 'Levante', 'Naan', 'Nice', 'Oltre', 'Orchestra', 'Palu', 'Peonia', 'Scacco'] },
    { name: 'SLAMP', collections: ['Accordeon', 'Aria', 'Avia', 'Clizia', 'Cordoba', 'Diamond', 'Hugo', 'La Belle', 'Modula', 'Nuvem', 'Tulip', 'Veli'] },
    { name: 'ZAFFERANO', collections: ['Aged', 'Altopiano', 'Angelina', 'Baby', 'Bilia', 'Bonnie e Clyde', 'Circe', 'Dama', 'Esperienze', 'Gamba De Vero', 'Gessato', 'Home Wall Lamps kit', 'Home table', 'Lido', 'Mentos', 'Multi-contact charging base', 'Olimpia', 'Oyster', 'Party Tumbler', 'Patea', 'Pencil', 'Perle', 'Pina', 'Poldina', 'Push Up', 'Riga', 'Royal Family', 'Sfera & Sfer’Otto', 'Sferis', 'Sister', 'Swap', 'Tex', 'Tirache', 'Tue', 'Twiddle', 'Ultralight', 'Uniche', 'Vem', 'Veneziano'] }
  ]
};

export default function CatalogManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState('');
  
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [b, c] = await Promise.all([getBrands(), getCategories()]);
      setBrands(b);
      setCategories(c);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm("This will populate the database with default Brands and Categories. Continue?")) return;
    
    setSeeding(true);
    setStatus('Starting population...');
    
    try {
      setStatus(`Adding ${INITIAL_DATA.categories.length} Categories...`);
      for (const cat of INITIAL_DATA.categories) {
        await addCategory(cat);
      }

      setStatus(`Adding ${INITIAL_DATA.brands.length} Brands...`);
      for (const brandData of INITIAL_DATA.brands) {
        await addBrand(brandData.name);
        const brandId = brandData.name.toLowerCase().replace(/\s+/g, '-');
        for (const coll of brandData.collections) {
          await addCollectionToBrand(brandId, coll);
        }
      }

      setStatus('Done!');
      loadData(); 
    } catch (err) {
      console.error(err);
      setStatus('Error occurred during seeding.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h2">Catalog Management</h1>
          <p className="muted">Manage Brands, Collections, and Categories</p>
        </div>
        
        <Button 
          onClick={handleSeed} 
          isLoading={seeding}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={cn("w-4 h-4", seeding && "animate-spin")} />
          {seeding ? status : 'Populate Default Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CATEGORIES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="h4">Categories ({categories.length})</h3>
            <Button size="icon" variant="ghost">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          {/* REFACTOR: Using Card */}
          <Card className="overflow-hidden">
            {categories.length === 0 ? (
              <div className="p-8 text-center muted">No categories found. Click Populate.</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-3 text-sm hover:bg-gray-50 flex justify-between group">
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* BRANDS */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
            <h3 className="h4">Brands ({brands.length})</h3>
            <Button size="icon" variant="ghost">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2">
             {brands.length === 0 ? (
              <div className="p-8 text-center muted bg-white border rounded-lg">No brands found. Click Populate.</div>
            ) : (
              brands.map((brand) => (
                /* REFACTOR: Using Card */
                <Card key={brand.id} className="overflow-hidden transition-all">
                  
                  <button 
                    onClick={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold">{brand.name}</span>
                    <div className="flex items-center gap-2 muted">
                      <span className="text-xs">{brand.collections.length} Collections</span>
                      {expandedBrand === brand.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedBrand === brand.id && (
                    <div className="bg-gray-50 border-t border-gray-100 p-4 flex flex-wrap gap-2">
                      {brand.collections.map((col, idx) => (
                        /* REFACTOR: Using Badge */
                        <Badge key={idx} variant="outline" className="bg-white">
                          {col}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="border-dashed cursor-pointer hover:border-primary hover:text-primary">
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Badge>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
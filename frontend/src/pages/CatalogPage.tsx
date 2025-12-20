import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, ChevronDown, ChevronRight, 
  ChevronsDown, ChevronsUp, PackageX, X 
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProductDetail } from '../components/catalog/ProductDetail';
import { ProductStatusBadge } from '../components/catalog/ProductStatusBadge';
import { useCatalog, type CatalogGroup, type SortOption } from '../hooks/useCatalog';
import type { Product } from '../types/inventory';
import { cn } from '../lib/utils';

// --- GROUP ITEM COMPONENT ---
const GroupItem = ({ 
  group, 
  forceExpand, 
  onProductClick 
}: { 
  group: CatalogGroup, 
  forceExpand: boolean,
  onProductClick: (p: Product) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isExpanded = forceExpand || isOpen;
  
  const hasProducts = group.products && group.products.length > 0;
  const hasChildren = group.children && group.children.length > 0;

  return (
    <div className="border-b border-gray-100 last:border-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer hover:bg-primary/5 transition-colors select-none group",
          group.level === 0 ? "bg-white" : "bg-gray-50/50"
        )}
        style={{ paddingLeft: `${group.level * 16 + 16}px` }}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
          )}
          
          <span className={cn(
            "font-medium text-gray-900 group-hover:text-primary transition-colors", 
            group.level === 0 ? "text-base" : "text-sm"
          )}>
            {group.key}
          </span>
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 text-gray-500 bg-gray-100 group-hover:bg-primary/10 group-hover:text-primary">
            {group.count}
          </Badge>
        </div>
      </div>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          {hasChildren && group.children?.map(child => (
            <GroupItem key={child.key} group={child} forceExpand={forceExpand} onProductClick={onProductClick} />
          ))}

          {hasProducts && group.products?.map(product => (
            <div 
              key={product.id}
              onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
              className="flex items-center gap-3 p-3 hover:bg-primary/5 cursor-pointer border-t border-gray-50 transition-colors group relative"
              style={{ paddingLeft: `${(group.level + 1) * 16 + 16}px` }}
            >
              <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-100 group-hover:border-primary/20">
                {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                  {product.productName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {product.brand} • {product.collectionName}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(product.priceIdr || 0)}
                </div>
                <div className="flex justify-end mt-1">
                   <ProductStatusBadge product={product} className="text-[9px] h-4 px-1" showStock />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CatalogPage() {
  const { activeView } = useOutletContext<{ activeView: string }>();
  const { searchQuery, setSearchQuery, groupedCatalog, sortOption, setSortOption, totalCount, loading } = useCatalog(activeView);
  
  const [expandAll, setExpandAll] = useState(false);
  const [resetKey, setResetKey] = useState(0); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleExpandAll = () => setExpandAll(true);
  
  const handleCollapseAll = () => {
    setExpandAll(false);
    setResetKey(prev => prev + 1);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading catalog...</div>;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 space-y-3 shadow-sm">
        
        <div className="relative">
          <Input 
            placeholder="Search..." 
            className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-primary p-1 hover:bg-primary/5 rounded-full transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {totalCount} Items
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-gray-50 border border-gray-200 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer hover:border-primary/50 transition-colors"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="name_asc">A-Z</option>
              <option value="name_desc">Z-A</option>
              <option value="price_asc">Lowest Price</option>
              <option value="price_desc">Highest Price</option>
            </select>
            
            <div className="flex bg-gray-50 rounded-md border border-gray-200 p-0.5">
              {/* FIX: Removed conditional logic. Both buttons are now simple ghost buttons. */}
              <Button 
                size="icon-sm" 
                variant="ghost" 
                onClick={handleExpandAll}
                title="Expand All"
              >
                <ChevronsDown className="w-4 h-4" />
              </Button>
              <Button 
                size="icon-sm" 
                variant="ghost" 
                onClick={handleCollapseAll}
                title="Collapse All"
              >
                <ChevronsUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <PackageX className="w-12 h-12 mb-2 opacity-50" />
            <p>No products found</p>
          </div>
        ) : (
          <div key={resetKey}>
            {groupedCatalog.map(group => (
              <GroupItem 
                key={group.key} 
                group={group} 
                forceExpand={expandAll || !!searchQuery}
                onProductClick={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetail 
        isOpen={!!selectedProduct} 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}
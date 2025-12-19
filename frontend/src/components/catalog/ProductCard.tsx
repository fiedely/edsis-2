import { ImageOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProductStatusBadge } from './ProductStatusBadge'; // New Import
import type { Product } from '../../types/inventory';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.priceIdr || 0);

  return (
    <Card 
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white h-full"
    >
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <ImageOff className="w-8 h-8" />
          </div>
        )}

        {/* Reusable Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <ProductStatusBadge product={product} />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
          {product.brand} • {product.collectionName}
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[2.5em]">
          {product.productName}
        </h3>

        <p className="text-xs text-gray-500 truncate mt-1">
          {product.finishing || 'Standard'}
        </p>

        <div className="mt-auto pt-2 flex items-end justify-between">
          <span className="text-sm font-bold text-primary">
            {formattedPrice}
          </span>
          <div 
            className={cn(
              "w-2 h-2 rounded-full",
              product.totalQty > 0 ? "bg-green-500" : "bg-gray-300"
            )} 
          />
        </div>
      </div>
    </Card>
  );
}
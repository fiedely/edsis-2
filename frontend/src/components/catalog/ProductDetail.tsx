import { X, ImageOff, Tag, Ruler, Info, Factory, Palette } from 'lucide-react';
import { ProductStatusBadge } from './ProductStatusBadge';
import type { Product } from '../../types/inventory';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  if (!isOpen || !product) return null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.priceIdr || 0);

  return (
    <>
      {/* 1. FULL SCREEN CONTAINER (z-50 covers everything) */}
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-5 duration-200">
        
        {/* Header Image Area */}
        <div className="relative w-full h-[40vh] bg-gray-100 shrink-0">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.productName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageOff className="w-16 h-16" />
            </div>
          )}
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Reusable Badge */}
          <div className="absolute bottom-4 left-4">
            <ProductStatusBadge product={product} showStock />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
          
          {/* Title Section */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              <span>{product.brand}</span>
              <span className="text-gray-300">•</span>
              <span>{product.collectionName}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">{product.productName}</h2>
            <div className="text-sm text-gray-500 mt-1 font-medium">{product.category}</div>
          </div>

          {/* Price & Stocks Row */}
          <div className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Retail Price</div>
              <div className="text-2xl font-bold text-primary">{formattedPrice}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Stocks</div>
              <div className="flex items-center gap-4">
                 <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900 leading-none">{product.totalQty}</span>
                    <span className="text-[10px] text-gray-400">Total</span>
                 </div>
                 <div className="w-px h-8 bg-gray-200" />
                 <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900 leading-none">{product.bookedQty}</span>
                    <span className="text-[10px] text-gray-400">Booked</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Tag className="w-3 h-3" /> SKU
              </div>
              <p className="text-base font-medium font-mono text-gray-900 tracking-tight">{product.sku}</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Factory className="w-3 h-3" /> Manuf. ID
              </div>
              <p className="text-base font-medium text-gray-900">{product.manufacturerId || '-'}</p>
            </div>

            <div className="space-y-1.5 col-span-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Ruler className="w-3 h-3" /> Dimensions
              </div>
              <p className="text-base text-gray-900">{product.dimensions || 'N/A'}</p>
            </div>

            <div className="space-y-1.5 col-span-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                <Palette className="w-3 h-3" /> Finishing
              </div>
              <p className="text-base text-gray-900">
                {product.finishing || 'Standard'}
              </p>
            </div>

            {product.detail && (
              <div className="space-y-1.5 col-span-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                  <Info className="w-3 h-3" /> Details
                </div>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {product.detail}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
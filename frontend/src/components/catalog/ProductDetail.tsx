import { useState } from 'react';
import { X, ImageOff, Tag, Ruler, Info, Factory, Palette, ZoomIn, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProductStatusBadge } from './ProductStatusBadge';
import type { Product } from '../../types/inventory';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen || !product) return null;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.priceIdr || 0);

  // Common styles for detail values
  const detailValueStyle = "text-sm font-medium text-gray-900 font-mono tracking-tight";
  const labelStyle = "flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase";

  return (
    <>
      {/* --- IMAGE ZOOM OVERLAY --- */}
      {isZoomed && product.imageUrl && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          {/* FIX: Used Reusable Glass Button */}
          <Button
            variant="glass"
            size="icon"
            className="absolute top-4 right-4 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <img 
            src={product.imageUrl} 
            alt={product.productName} 
            className="max-w-full max-h-[90vh] object-contain cursor-zoom-out"
          />
        </div>
      )}

      {/* --- MAIN FULL SCREEN MODAL --- */}
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-5 duration-200">
        
        {/* Header Image Area with Overlay */}
        <div className="relative w-full h-[45vh] bg-gray-100 shrink-0 group">
          {product.imageUrl ? (
            <div 
              className="w-full h-full cursor-zoom-in relative"
              onClick={() => setIsZoomed(true)}
            >
              <img 
                src={product.imageUrl} 
                alt={product.productName} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
              />
              {/* Zoom Hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 backdrop-blur-sm">
                  <ZoomIn className="w-3 h-3" /> View Full Image
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageOff className="w-16 h-16" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          
          {/* Overlay Content */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <div className="mb-2">
               <ProductStatusBadge product={product} showStock />
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-md">{product.productName}</h2>
            <div className="text-sm text-gray-200 mt-1 font-medium drop-shadow-md">{product.category}</div>
          </div>
          
          {/* FIX: Used Reusable Glass Button */}
          <Button 
            variant="glass"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full z-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative">
          
          {/* Sticky Price & Stock Section */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Retail Price</div>
                  <div className="text-2xl font-bold text-primary">{formattedPrice}</div>
                </div>
                
                {/* Centered Stock Section */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Stocks</div>
                  <div className="flex items-center gap-4 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                     <div className="text-center min-w-12">
                        <span className="block text-lg font-bold text-gray-900 leading-none">{product.totalQty}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wide">Total</span>
                     </div>
                     <div className="w-px h-6 bg-gray-200" />
                     <div className="text-center min-w-12">
                        <span className="block text-lg font-bold text-gray-900 leading-none">{product.bookedQty}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wide">Booked</span>
                     </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-6 pb-24">
            
            {/* Brand & Collection */}
            <div className="space-y-1.5 col-span-2">
               <div className={labelStyle}>
                  <Layers className="w-3 h-3" /> Brand & Collection
               </div>
               <p className={detailValueStyle}>
                 {product.brand} <span className="text-gray-400 font-normal mx-1">•</span> {product.collectionName}
               </p>
            </div>

            <div className="space-y-1.5">
              <div className={labelStyle}>
                <Tag className="w-3 h-3" /> SKU
              </div>
              <p className={detailValueStyle}>{product.sku}</p>
            </div>
            
            <div className="space-y-1.5">
              <div className={labelStyle}>
                <Factory className="w-3 h-3" /> Manuf. ID
              </div>
              <p className={detailValueStyle}>{product.manufacturerId || '-'}</p>
            </div>

            <div className="space-y-1.5 col-span-2">
              <div className={labelStyle}>
                <Ruler className="w-3 h-3" /> Dimensions
              </div>
              <p className={detailValueStyle}>{product.dimensions || 'N/A'}</p>
            </div>

            <div className="space-y-1.5 col-span-2">
              <div className={labelStyle}>
                <Palette className="w-3 h-3" /> Finishing
              </div>
              <p className={detailValueStyle}>
                {product.finishing || 'Standard'}
              </p>
            </div>

            {product.detail && (
              <div className="space-y-1.5 col-span-2">
                <div className={labelStyle}>
                  <Info className="w-3 h-3" /> Details
                </div>
                <p className={`${detailValueStyle} leading-relaxed`}>
                  {product.detail}
                </p>
              </div>
            )}
          </div>

        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 z-30 relative">
          <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
        </div>
      </div>
    </>
  );
}
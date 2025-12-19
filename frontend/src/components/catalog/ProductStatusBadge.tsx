import { Badge } from '../ui/Badge';
import type { Product } from '../../types/inventory';

interface Props {
  product: Product;
  className?: string;
  showStock?: boolean;
}

export function ProductStatusBadge({ product, className, showStock = false }: Props) {
  if (product.isNotForSale) {
    return <Badge variant="destructive" className={className}>Not for Sale</Badge>;
  }
  
  if (product.isUpcoming) {
    return <Badge variant="secondary" className={`bg-blue-500 text-white hover:bg-blue-600 ${className}`}>Upcoming</Badge>;
  }

  if (showStock && product.totalQty === 0) {
    return <Badge variant="outline" className={`bg-gray-800 text-white border-none ${className}`}>Out of Stock</Badge>;
  }

  return null;
}
import { BookOpen, Box } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-40 pb-safe">
      <NavLink 
        to="/catalog" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
        )}
      >
        <BookOpen className="w-6 h-6" />
        CATALOG
      </NavLink>
      
      <div className="w-px h-8 bg-gray-200" /> {/* Vertical Divider */}

      <NavLink 
        to="/inventory" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center w-full h-full gap-1 text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
        )}
      >
        <Box className="w-6 h-6" />
        INVENTORY
      </NavLink>
    </div>
  );
}
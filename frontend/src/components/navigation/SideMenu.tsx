import { X, Shield, LayoutGrid, LogOut, Box } from 'lucide-react';
import { cn } from '../../lib/utils';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header */}
        <div className="p-6 bg-primary text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">EDSIS</h2>
          <p className="text-xs text-primary-100 uppercase tracking-widest opacity-80 mt-1">
            Elementi Domus
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Management
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => handleNav('/catalog-management')}
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary gap-3 transition-colors text-sm font-medium"
            >
              <LayoutGrid className="w-5 h-5" />
              Catalog Management
            </button>
            <button className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary gap-3 transition-colors text-sm font-medium">
              <Box className="w-5 h-5" />
              Inventory Management
            </button>
            <button className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary gap-3 transition-colors text-sm font-medium">
              <Shield className="w-5 h-5" />
              Admin & Users
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center justify-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg gap-2 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </>
  );
}
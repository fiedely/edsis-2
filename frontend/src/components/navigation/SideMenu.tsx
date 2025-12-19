import { X, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../../config/menu';

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
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        <div className="p-6 bg-primary text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold tracking-tight">EDSIS</h2>
          <p className="text-xs text-primary-100 uppercase tracking-widest opacity-80 mt-1">
            Elementi Domus
          </p>
        </div>

        <div className="flex-1 py-6 overflow-y-auto space-y-6">
          
          {/* GROUP 1: MANAGEMENT */}
          <div>
            <div className="px-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Management
            </div>
            <nav className="space-y-1">
              {MENU_ITEMS.filter(item => item.section === 'management').map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary gap-3 transition-colors text-sm font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* GROUP 2: ADMIN (Only if Access Allows - For now we show all) */}
          <div>
            <div className="px-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              System Admin
            </div>
            <nav className="space-y-1">
              {MENU_ITEMS.filter(item => item.section === 'admin').map(item => (
                <button 
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary gap-3 transition-colors text-sm font-medium"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

        </div>

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
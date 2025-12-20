import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SideMenu } from '../components/navigation/SideMenu';
import { BottomNav } from '../components/navigation/BottomNav';
import { ViewSwitcher } from '../components/catalog/ViewSwitcher';
import { Button } from '../components/ui/Button';

export function AppLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('1'); 
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('catalog-management')) return 'Catalog Management';
    if (path.includes('inventory')) return 'Inventory';
    if (path.includes('admin')) return 'Admin Tools';
    return 'Catalog';
  };

  return (
    <div className="flex flex-col h-dvh w-full bg-gray-50 text-gray-900 font-sans">
      
      {/* 1. TOP BAR */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0 z-30 relative">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon-sm"
            onClick={() => setIsSideMenuOpen(true)}
            className="-ml-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <h1 className="font-bold text-lg text-primary tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full border border-white shadow-sm" />
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        <aside className="shrink-0 h-full z-20 border-r border-gray-200 bg-white">
          <ViewSwitcher activeViewId={activeView} onSelectView={setActiveView} />
        </aside>

        <main className="flex-1 relative overflow-y-auto w-full pb-24 scroll-smooth">
          <Outlet context={{ activeView }} /> 
        </main>
      </div>

      <BottomNav />
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
    </div>
  );
}
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SideMenu } from '../components/navigation/SideMenu';
import { BottomNav } from '../components/navigation/BottomNav';
import { ViewSwitcher } from '../components/catalog/ViewSwitcher';

export function AppLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('1'); // Default view

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900 overflow-hidden font-sans">
      
      {/* 1. TOP BAR (Global App Header) */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSideMenuOpen(true)}
            className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-primary tracking-tight">Catalog</h1>
        </div>
        
        {/* Placeholder for User Avatar */}
        <div className="w-8 h-8 bg-gray-200 rounded-full border border-white shadow-sm" />
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* A. THIN SIDEBAR (View Switcher) */}
        <aside className="shrink-0 h-full z-20">
          <ViewSwitcher activeViewId={activeView} onSelectView={setActiveView} />
        </aside>

        {/* B. CONTENT AREA (Scrollable) */}
        <main className="flex-1 relative overflow-hidden flex flex-col w-full">
          {/* This is where the Catalog or Inventory page renders */}
          <Outlet context={{ activeView }} /> 
        </main>

      </div>

      {/* 3. BOTTOM NAV - Always Visible */}
      <BottomNav />

      {/* 4. SIDE MENU DRAWER - Hidden by default */}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />

    </div>
  );
}
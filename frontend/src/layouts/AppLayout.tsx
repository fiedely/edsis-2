import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SideMenu } from '../components/navigation/SideMenu';
import { BottomNav } from '../components/navigation/BottomNav';
import { ViewSwitcher } from '../components/catalog/ViewSwitcher';

export function AppLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('1'); 

  return (
    // FIX 1: Use 'h-[100dvh]' instead of 'h-screen' to fix mobile browser URL bar issues
    <div className="flex flex-col h-[dvh] w-full bg-gray-50 text-gray-900 font-sans">
      
      {/* 1. TOP BAR */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between shrink-0 z-30 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSideMenuOpen(true)}
            className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg text-primary tracking-tight">Catalog</h1>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full border border-white shadow-sm" />
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* A. THIN SIDEBAR (Hidden on mobile, visible on desktop) */}
        <aside className="shrink-0 h-full z-20 hidden md:block border-r border-gray-200 bg-white">
          <ViewSwitcher activeViewId={activeView} onSelectView={setActiveView} />
        </aside>

        {/* B. CONTENT AREA */}
        {/* FIX 2: Changed 'overflow-hidden' to 'overflow-y-auto' so you can SCROLL */}
        {/* FIX 3: Added 'pb-24' (padding bottom) so the Bottom Nav doesn't hide content */}
        <main className="flex-1 relative overflow-y-auto w-full pb-24 scroll-smooth">
          <Outlet context={{ activeView }} /> 
        </main>

      </div>

      {/* 3. BOTTOM NAV */}
      <BottomNav />

      {/* 4. SIDE MENU */}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />

    </div>
  );
}
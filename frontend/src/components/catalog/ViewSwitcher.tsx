import { LayoutList, Layers, MapPin, Grid, List } from 'lucide-react';
import { cn } from '../../lib/utils';

// These correspond to the user requirements for "Saved Views"
const SAVED_VIEWS = [
  { id: '1', name: 'Brand > Cat', icon: Layers },
  { id: '2', name: 'Cat > Brand', icon: LayoutList },
  { id: '3', name: 'Location', icon: MapPin },
  { id: '4', name: 'Flat List', icon: List },
  { id: '5', name: 'Custom', icon: Grid },
];

interface ViewSwitcherProps {
  activeViewId: string;
  onSelectView: (id: string) => void;
}

export function ViewSwitcher({ activeViewId, onSelectView }: ViewSwitcherProps) {
  return (
    <div className="w-[50px] bg-gray-50 border-r border-gray-200 flex flex-col items-center py-2 gap-3 z-30 h-full">
      {SAVED_VIEWS.map((view) => {
        const Icon = view.icon;
        const isActive = activeViewId === view.id;
        
        return (
          <button
            key={view.id}
            onClick={() => onSelectView(view.id)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group",
              isActive 
                ? "bg-white text-primary shadow-sm ring-1 ring-gray-200" 
                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
            )}
            title={view.name}
          >
            <Icon className="w-5 h-5" />
            
            {/* Desktop Tooltip (Hidden on mobile) */}
            <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
              {view.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}
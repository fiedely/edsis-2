import { Box, LayoutGrid, Shield, BookOpen, Wrench } from 'lucide-react';
import type { MenuItem } from '../types/rbac';

export const MENU_ITEMS: MenuItem[] = [
  // MAIN
  { 
    id: 'catalog_view', 
    label: 'Catalog', 
    path: '/catalog', 
    icon: BookOpen, 
    section: 'main' 
  },
  { 
    id: 'inventory_view', 
    label: 'Inventory', 
    path: '/inventory', 
    icon: Box, 
    section: 'main' 
  },
  
  // MANAGEMENT
  { 
    id: 'catalog_mgmt', 
    label: 'Catalog Management', 
    path: '/catalog-management', 
    icon: LayoutGrid, 
    section: 'management' 
  },
  { 
    id: 'inventory_mgmt', 
    label: 'Inventory Management', 
    path: '/inventory-management', 
    icon: Box, 
    section: 'management' 
  },

  // ADMIN
  { 
    id: 'admin_tools', 
    label: 'Admin Tools', 
    path: '/admin-tools', 
    icon: Wrench, 
    section: 'admin' 
  },
  { 
    id: 'user_access', 
    label: 'User Access', 
    path: '/user-access', 
    icon: Shield, 
    section: 'admin' 
  }
];
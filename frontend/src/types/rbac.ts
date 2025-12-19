export type Action = 'view' | 'add' | 'edit' | 'delete';

export interface MenuPermission {
  menuId: string;
  actions: Action[];
}

export interface UserGroup {
  id: string;
  name: string; // e.g., "Super Admin", "Store Manager", "Viewer"
  permissions: MenuPermission[];
}

// Global Menu Configuration
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: any; // Lucide icon
  section: 'main' | 'management' | 'admin';
}
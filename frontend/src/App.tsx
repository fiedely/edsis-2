import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthOverlay from './components/AuthOverlay';
import { AppLayout } from './layouts/AppLayout';

// Pages
import CatalogManagement from './pages/CatalogManagement';

// Placeholder Pages for now
const CatalogPage = () => <div className="p-4">Catalog List (Coming Soon)</div>;
const InventoryPage = () => <div className="p-4">Inventory List (Coming Soon)</div>;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!user) return <AuthOverlay />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          
          {/* NEW ROUTE */}
          <Route path="/catalog-management" element={<CatalogManagement />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
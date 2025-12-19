import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth'; // Fix: type-only import
import { auth } from './firebase'; 
import AuthOverlay from './components/AuthOverlay';

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

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-primary">Loading...</div>;
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-4 font-sans overflow-hidden">
      
      {/* GATEKEEPER: Renders if no user is found */}
      {!user && <AuthOverlay />}

      {/* MAIN CONTENT: Blurred when logged out */}
      <div className={`transition-all duration-500 ${!user ? 'blur-sm scale-95 opacity-50 pointer-events-none' : 'blur-0 scale-100 opacity-100'}`}>
        <h1 className="text-4xl font-bold text-primary">
          Elementi Domus
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Welcome, {user?.email}
        </p>
        
        {user && (
          <button 
            onClick={() => auth.signOut()}
            className="mt-6 px-6 py-2 bg-gray-800 text-white text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Log Out
          </button>
        )}
      </div>

    </div>
  );
}

export default App;
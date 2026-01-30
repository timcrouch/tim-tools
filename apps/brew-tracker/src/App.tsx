import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PinEntry } from './components/PinEntry';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BatchList } from './pages/BatchList';
import { BatchDetail } from './pages/BatchDetail';
import { NewBatch } from './pages/NewBatch';
import { Recipes } from './pages/Recipes';
import { Calculator } from './pages/Calculator';
import { Settings } from './pages/Settings';

function AppContent() {
  const { isAuthenticated, isLoading, needsSetup } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍺</div>
          <p className="text-amber-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || needsSetup) {
    return <PinEntry />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/batches" element={<BatchList />} />
        <Route path="/batches/new" element={<NewBatch />} />
        <Route path="/batches/:id" element={<BatchDetail />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter basename="/apps/brew-tracker">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { setPin, verifyPin } from '../lib/supabase';
import { exportData } from '../hooks/useData';

export function Settings() {
  const { logout } = useAuth();
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleChangePIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    // Verify current PIN
    const isValid = await verifyPin(currentPin);
    if (!isValid) {
      setPinError('Current PIN is incorrect');
      return;
    }

    // Validate new PIN
    if (!/^\d{4}$/.test(newPin)) {
      setPinError('New PIN must be exactly 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('New PINs do not match');
      return;
    }

    // Set new PIN
    const success = await setPin(newPin);
    if (success) {
      setPinSuccess(true);
      setShowChangePIN(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinError('Failed to update PIN');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brew-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">⚙️ Settings</h1>

      {/* Security */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-4">🔒 Security</h2>
        
        {pinSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4">
            ✅ PIN updated successfully!
          </div>
        )}

        {!showChangePIN ? (
          <div className="space-y-3">
            <button onClick={() => setShowChangePIN(true)} className="btn-secondary w-full">
              Change PIN
            </button>
            <button onClick={logout} className="btn-secondary w-full">
              🔒 Lock App
            </button>
          </div>
        ) : (
          <form onSubmit={handleChangePIN} className="space-y-4">
            <div>
              <label className="block text-sm text-amber-600 mb-1">Current PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input-field text-center text-xl tracking-widest font-mono"
                placeholder="••••"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-600 mb-1">New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input-field text-center text-xl tracking-widest font-mono"
                placeholder="••••"
              />
            </div>
            <div>
              <label className="block text-sm text-amber-600 mb-1">Confirm New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input-field text-center text-xl tracking-widest font-mono"
                placeholder="••••"
              />
            </div>
            
            {pinError && (
              <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{pinError}</p>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">Save</button>
              <button 
                type="button" 
                onClick={() => {
                  setShowChangePIN(false);
                  setCurrentPin('');
                  setNewPin('');
                  setConfirmPin('');
                  setPinError('');
                }} 
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Data */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-4">💾 Data</h2>
        <button 
          onClick={handleExport} 
          disabled={isExporting}
          className="btn-secondary w-full disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : '📥 Export All Data (JSON)'}
        </button>
        <p className="text-xs text-amber-500 mt-2 text-center">
          Downloads all batches, recipes, and readings as a JSON file
        </p>
      </div>

      {/* About */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-4">ℹ️ About</h2>
        <div className="text-center">
          <div className="text-5xl mb-3">🍺</div>
          <h3 className="font-bold text-amber-900 text-xl">Brew Tracker</h3>
          <p className="text-amber-600 text-sm mt-1">Version 1.0.0</p>
          <p className="text-amber-500 text-xs mt-4">
            Track your homebrewing adventures with style!
          </p>
        </div>
      </div>

      {/* Help */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-4">❓ Quick Tips</h2>
        <div className="space-y-3 text-sm text-amber-700">
          <div className="flex items-start gap-3">
            <span className="text-xl">🫧</span>
            <div>
              <strong>Fermenting:</strong> Take gravity readings every few days to track progress.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📊</span>
            <div>
              <strong>ABV Formula:</strong> (OG - FG) × 131.25 gives you alcohol percentage.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🔔</span>
            <div>
              <strong>Reminders:</strong> Set reminders for important dates like racking, bottling, or when to drink!
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📖</span>
            <div>
              <strong>Recipes:</strong> Save successful batches as recipes to brew again later.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-amber-400 py-4">
        Made with 🍺 for Tim's brewing adventures
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function PinEntry() {
  const { login, setupPin, needsSetup } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (needsSetup) {
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        setError('PIN must be exactly 4 digits');
        setIsSubmitting(false);
        return;
      }
      if (pin !== confirmPin) {
        setError('PINs do not match');
        setIsSubmitting(false);
        return;
      }
      const success = await setupPin(pin);
      if (!success) {
        setError('Failed to set PIN. Check your connection.');
      }
    } else {
      const success = await login(pin);
      if (!success) {
        setError('Invalid PIN');
        setPin('');
      }
    }
    
    setIsSubmitting(false);
  };

  const handlePinChange = (value: string, setter: (v: string) => void) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setter(cleaned);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="brew-card p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍺</div>
          <h1 className="text-2xl font-bold text-amber-900">Brew Tracker</h1>
          <p className="text-amber-700 mt-2">
            {needsSetup ? 'Set up your 4-digit PIN' : 'Enter your PIN to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              {needsSetup ? 'Create PIN' : 'PIN'}
            </label>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value, setPin)}
              className="input-field text-center text-2xl tracking-[0.5em] font-mono"
              placeholder="••••"
              autoFocus
            />
          </div>

          {needsSetup && (
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => handlePinChange(e.target.value, setConfirmPin)}
                className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="••••"
              />
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || pin.length !== 4 || (needsSetup && confirmPin.length !== 4)}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Please wait...' : needsSetup ? 'Set PIN' : 'Unlock'}
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < pin.length ? 'bg-amber-500' : 'bg-amber-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

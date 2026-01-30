import { useState } from 'react';
import { calculateABV, calculateAttenuation } from '../lib/utils';

export function Calculator() {
  const [og, setOG] = useState('');
  const [fg, setFG] = useState('');
  
  const ogNum = parseFloat(og) || null;
  const fgNum = parseFloat(fg) || null;
  const abv = calculateABV(ogNum, fgNum);
  const attenuation = calculateAttenuation(ogNum, fgNum);

  // Common gravity presets
  const commonGravities = [
    { label: 'Light (Beer)', og: 1.040, fg: 1.010 },
    { label: 'Medium (Cider)', og: 1.055, fg: 1.005 },
    { label: 'Strong (Wine)', og: 1.090, fg: 0.998 },
    { label: 'Mead', og: 1.120, fg: 1.010 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-amber-900">🧮 ABV Calculator</h1>

      <div className="brew-card p-6 space-y-6">
        <div className="text-center">
          <span className="text-6xl">🍺</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-amber-600 mb-2 text-center">Original Gravity</label>
            <input
              type="number"
              step="0.001"
              placeholder="1.055"
              value={og}
              onChange={(e) => setOG(e.target.value)}
              className="input-field text-2xl font-mono text-center"
            />
            <p className="text-xs text-amber-500 text-center mt-1">Before fermentation</p>
          </div>
          <div>
            <label className="block text-sm text-amber-600 mb-2 text-center">Final Gravity</label>
            <input
              type="number"
              step="0.001"
              placeholder="1.005"
              value={fg}
              onChange={(e) => setFG(e.target.value)}
              className="input-field text-2xl font-mono text-center"
            />
            <p className="text-xs text-amber-500 text-center mt-1">After fermentation</p>
          </div>
        </div>

        {/* Results */}
        {abv !== null && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white text-center">
            <div className="text-5xl font-bold mb-2">{abv}%</div>
            <div className="text-amber-100 text-lg">ABV (Alcohol By Volume)</div>
          </div>
        )}

        {attenuation !== null && (
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-900">{attenuation}%</div>
            <div className="text-amber-600">Attenuation</div>
            <p className="text-xs text-amber-500 mt-2">
              {attenuation < 65 ? 'Low - lots of residual sugars (sweet)' :
               attenuation < 75 ? 'Medium - balanced sweetness' :
               attenuation < 85 ? 'High - most sugars converted (dry)' :
               'Very High - very dry finish'}
            </p>
          </div>
        )}

        {/* Formula explanation */}
        <div className="bg-amber-50 rounded-xl p-4">
          <h3 className="font-bold text-amber-900 mb-2">📐 The Formula</h3>
          <code className="text-amber-700 block text-center py-2 bg-white rounded-lg">
            ABV = (OG - FG) × 131.25
          </code>
          <p className="text-xs text-amber-600 mt-2">
            This formula estimates the alcohol content by measuring how much sugar was consumed by the yeast.
          </p>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-3">⚡ Quick Presets</h2>
        <div className="grid grid-cols-2 gap-2">
          {commonGravities.map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                setOG(preset.og.toString());
                setFG(preset.fg.toString());
              }}
              className="btn-secondary text-sm py-3"
            >
              <div className="font-medium">{preset.label}</div>
              <div className="text-xs text-amber-500">
                OG: {preset.og} → FG: {preset.fg}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Temperature Correction Note */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-2">🌡️ Temperature Note</h2>
        <p className="text-sm text-amber-600">
          Hydrometers are calibrated for a specific temperature (usually 60°F/15.5°C). 
          For accurate readings, take measurements at the calibration temperature or use 
          a temperature correction calculator.
        </p>
      </div>

      {/* Gravity Reference */}
      <div className="brew-card p-4">
        <h2 className="font-bold text-amber-900 mb-3">📊 Gravity Reference</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1 border-b border-amber-100">
            <span className="text-amber-600">Water</span>
            <span className="font-mono text-amber-900">1.000</span>
          </div>
          <div className="flex justify-between py-1 border-b border-amber-100">
            <span className="text-amber-600">Light Beer</span>
            <span className="font-mono text-amber-900">1.030 - 1.045</span>
          </div>
          <div className="flex justify-between py-1 border-b border-amber-100">
            <span className="text-amber-600">Cider</span>
            <span className="font-mono text-amber-900">1.045 - 1.065</span>
          </div>
          <div className="flex justify-between py-1 border-b border-amber-100">
            <span className="text-amber-600">Strong Beer</span>
            <span className="font-mono text-amber-900">1.065 - 1.090</span>
          </div>
          <div className="flex justify-between py-1 border-b border-amber-100">
            <span className="text-amber-600">Wine</span>
            <span className="font-mono text-amber-900">1.080 - 1.120</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-amber-600">Mead</span>
            <span className="font-mono text-amber-900">1.100 - 1.140</span>
          </div>
        </div>
      </div>
    </div>
  );
}

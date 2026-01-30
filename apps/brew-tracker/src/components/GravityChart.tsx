import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';
import type { GravityReading } from '../types';

interface GravityChartProps {
  readings: GravityReading[];
}

export function GravityChart({ readings }: GravityChartProps) {
  const data = readings.map(r => ({
    date: format(parseISO(r.reading_date), 'MMM d'),
    gravity: r.gravity,
    temperature: r.temperature,
  }));

  const minGravity = Math.min(...readings.map(r => r.gravity)) - 0.005;
  const maxGravity = Math.max(...readings.map(r => r.gravity)) + 0.005;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#B45309', fontSize: 11 }}
            axisLine={{ stroke: '#F59E0B' }}
            tickLine={{ stroke: '#F59E0B' }}
          />
          <YAxis 
            domain={[minGravity, maxGravity]}
            tick={{ fill: '#B45309', fontSize: 11 }}
            axisLine={{ stroke: '#F59E0B' }}
            tickLine={{ stroke: '#F59E0B' }}
            tickFormatter={(value) => value.toFixed(3)}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FEF3C7', 
              border: '1px solid #F59E0B',
              borderRadius: '8px',
            }}
            formatter={(value) => typeof value === 'number' ? [value.toFixed(3), 'Gravity'] : [String(value), 'Gravity']}
          />
          <ReferenceLine y={1.000} stroke="#22C55E" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="gravity" 
            stroke="#F59E0B" 
            strokeWidth={3}
            dot={{ fill: '#B45309', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#F59E0B' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

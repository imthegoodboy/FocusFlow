'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [productiveHours, setProductiveHours] = useState<any[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const [recs, hours] = await Promise.all([
        api.get('/api/ai/recommendations'),
        api.get('/api/ai/productive-hours'),
      ]);
      setRecommendations(recs.data.recommendations || []);
      setProductiveHours(hours.data.productive_hours || []);
    } catch (error) {
      console.error('Failed to load recommendations');
    }
  };

  if (recommendations.length === 0 && productiveHours.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">AI Recommendations 🤖</h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm">{rec}</p>
          </div>
        ))}
        {productiveHours.length > 0 && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm font-medium mb-2">Best Study Hours:</p>
            <div className="flex flex-wrap gap-2">
              {productiveHours.slice(0, 3).map((hour, index) => (
                <span key={index} className="px-3 py-1 bg-white bg-opacity-30 rounded">
                  {hour.start_hour}:00 - {hour.end_hour}:00
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


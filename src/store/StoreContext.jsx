import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_BASELINE } from '../data/constants';
import { calcAdherence, calcDataQuality } from '../utils/scoring';
import { getLocalDateString } from '../utils/formatters';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [baseline, setBaseline] = useState(DEFAULT_BASELINE);
  const [isLoading, setIsLoading] = useState(true);

  // Initial fetch from Supabase
  useEffect(() => {
    async function loadData() {
      console.log('Fetching initial data from Supabase...');
      try {
        // Fetch baseline (using select instead of single to be safer)
        const { data: bData, error: bError } = await supabase
          .from('app_state')
          .select('data')
          .eq('id', 'baseline');
        
        if (bError) {
          console.error('Supabase baseline fetch error:', bError);
        }

        if (bData && bData.length > 0) {
          console.log('Baseline loaded:', bData[0].data);
          setBaseline(bData[0].data);
        } else {
          console.log('No baseline found in Supabase, using default.');
        }

        // Fetch logs
        const { data: logsData, error: lError } = await supabase
          .from('daily_logs')
          .select('id, data');

        if (logsData) {
          const parsedLogs = logsData.map(r => r.data).sort((a, b) => a.date.localeCompare(b.date));
          setLogs(parsedLogs);
        }
      } catch (e) {
        console.error('Error fetching Supabase data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const addLog = useCallback(async (entry) => {
    const enriched = {
      ...entry,
      id: crypto.randomUUID ? crypto.randomUUID() : `${entry.date}-${Math.random().toString(36).slice(2)}`,
      adherenceScore: calcAdherence(entry, baseline),
      dataQualityScore: calcDataQuality(entry),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setLogs(prev => {
      const existing = prev.findIndex(l => l.date === entry.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...enriched, updatedAt: new Date().toISOString() };
        return updated;
      }
      return [...prev, enriched].sort((a, b) => a.date.localeCompare(b.date));
    });

    // Write to Supabase using the date as the unique ID for upserts
    await supabase
      .from('daily_logs')
      .upsert({ id: enriched.date, data: enriched });

  }, [baseline]);

  const updateLog = useCallback(async (date, updates) => {
    let finalUpdatedLog = null;

    // Optimistic UI update
    setLogs(prev => prev.map(l => {
      if (l.date !== date) return l;
      const updated = { ...l, ...updates };
      finalUpdatedLog = {
        ...updated,
        adherenceScore: calcAdherence(updated, baseline),
        dataQualityScore: calcDataQuality(updated),
        updatedAt: new Date().toISOString(),
      };
      return finalUpdatedLog;
    }));

    if (finalUpdatedLog) {
      // Write to Supabase
      await supabase
        .from('daily_logs')
        .upsert({ id: date, data: finalUpdatedLog });
    }
  }, [baseline]);

  const updateBaseline = useCallback(async (updates) => {
    const newBaseline = { ...baseline, ...updates };
    setBaseline(newBaseline);

    await supabase
      .from('app_state')
      .upsert({ id: 'baseline', data: newBaseline });
  }, [baseline]);

  const getLogByDate = useCallback((date) => {
    return logs.find(l => l.date === date) || null;
  }, [logs]);

  const getTodayLog = useCallback(() => {
    const today = getLocalDateString();
    return getLogByDate(today);
  }, [getLogByDate]);

  const getCurrentCycleLogs = useCallback(() => {
    const start = baseline.cycleStartDate;
    return logs.filter(l => l.date >= start).sort((a, b) => a.date.localeCompare(b.date));
  }, [logs, baseline.cycleStartDate]);

  const resetToSeedData = useCallback(() => {
    // Only resets local state, not Supabase (too dangerous for now)
    console.warn("Reset to seed data disabled when using cloud sync.");
  }, []);

  const value = {
    logs,
    baseline,
    isLoading,
    addLog,
    updateLog,
    updateBaseline,
    getLogByDate,
    getTodayLog,
    getCurrentCycleLogs,
    resetToSeedData,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

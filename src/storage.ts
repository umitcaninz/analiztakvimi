import { DataStore, Event } from './types';
import { calendarData } from './data';

const STORAGE_KEY = 'calendarDataStoreV1';

const postUpdateToDevServer = async (data: DataStore): Promise<void> => {
  try {
    // @ts-expect-error vite env access
    const isDev = import.meta?.env?.DEV;
    if (typeof window === 'undefined' || !isDev) return;
    await fetch('/__admin/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // ignore
  }
};

export const loadDataStore = (): DataStore => {
  try {
    if (typeof window === 'undefined') return calendarData;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return calendarData;
    const parsed = JSON.parse(raw) as DataStore;
    // Basic shape guard
    if (!parsed || typeof parsed !== 'object') return calendarData;
    return parsed;
  } catch {
    return calendarData;
  }
};

export const saveDataStore = (data: DataStore): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export type CategoryKey = keyof DataStore; // 'etkinlikler' | 'analizler' | 'haberler'

export const upsertEvent = (
  category: CategoryKey,
  previousDateKey: string | null,
  updatedEvent: Event,
  data: DataStore
): DataStore => {
  const next: DataStore = {
    ...data,
    [category]: { ...data[category] }
  } as DataStore;

  if (previousDateKey && previousDateKey !== updatedEvent.date) {
    delete (next[category] as Record<string, Event>)[previousDateKey];
  }

  (next[category] as Record<string, Event>)[updatedEvent.date] = { ...updatedEvent };
  saveDataStore(next);
  void postUpdateToDevServer(next);
  return next;
};

export const deleteEvent = (
  category: CategoryKey,
  dateKey: string,
  data: DataStore
): DataStore => {
  const next: DataStore = {
    ...data,
    [category]: { ...data[category] }
  } as DataStore;

  delete (next[category] as Record<string, Event>)[dateKey];
  saveDataStore(next);
  void postUpdateToDevServer(next);
  return next;
};



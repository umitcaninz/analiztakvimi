export interface Event {
  date: string;
  description: string;
  is_new: boolean;
  link?: string;  // Optional link field for clickable events
}

export interface DataStore {
  etkinlikler: Record<string, Event>;
  analizler: Record<string, Event>;
  haberler: Record<string, Event>;
}
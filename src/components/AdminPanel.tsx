import React, { useMemo, useState } from 'react';
import { DataStore, Event } from '../types';
import { CategoryKey, upsertEvent, deleteEvent } from '../storage';
import { turkishMonths } from '../data';

interface AdminPanelProps {
  data: DataStore;
  setData: (next: DataStore) => void;
  theme: string;
  onUpsert?: (category: CategoryKey, previousDateKey: string | null, updated: Event) => Promise<DataStore> | DataStore;
  onDelete?: (category: CategoryKey, dateKey: string) => Promise<DataStore> | DataStore;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, setData, theme, onUpsert: onUpsertProp, onDelete: onDeleteProp }) => {
  const [category, setCategory] = useState<CategoryKey>('analizler');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState<string>(''); // '' or '1'..'12'
  const [filterYear, setFilterYear] = useState<string>(''); // '' or '2023', '2024', ...

  const isDark = theme === 'dark';

  const list = useMemo(() => Object.values(data[category] || {}).sort((a, b) => a.date.localeCompare(b.date)), [data, category]);
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return list.filter(ev => {
      const d = new Date(ev.date);
      const mOk = filterMonth ? (d.getMonth() + 1) === Number(filterMonth) : true;
      const yOk = filterYear ? d.getFullYear() === Number(filterYear) : true;
      const tOk = s ? (ev.description.toLowerCase().includes(s) || ev.date.includes(s)) : true;
      return mOk && yOk && tOk;
    });
  }, [list, search, filterMonth, filterYear]);
  const current: Event = useMemo(() => {
    const fallback: Event = { date: '', description: '', is_new: false };
    if (!selectedKey) return fallback;
    return (data[category] as Record<string, Event>)[selectedKey] || fallback;
  }, [data, category, selectedKey]);

  const [form, setForm] = useState<Event>({ date: '', description: '', is_new: false, link: '' });

  const onSelect = (key: string | null) => {
    setSelectedKey(key);
    if (key) {
      const ev = (data[category] as Record<string, Event>)[key];
      setForm({ ...ev });
    } else {
      setForm({ date: '', description: '', is_new: false, link: '' });
    }
  };

  const onSave = async () => {
    if (!form.date) return;
    const clean: Event = { date: form.date, description: form.description, is_new: !!form.is_new };
    if (form.link) clean.link = form.link;
    if (typeof (onUpsertProp) === 'function') {
      const next = await onUpsertProp(category, selectedKey, clean) as DataStore;
      setData(next);
    } else {
      const next = upsertEvent(category, selectedKey, clean, data);
      setData(next);
    }
    setSelectedKey(clean.date);
  };

  const handleDelete = async () => {
    if (!selectedKey) return;
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    if (typeof (onDeleteProp) === 'function') {
      const next = await onDeleteProp(category, selectedKey) as DataStore;
      setData(next);
    } else {
      const next = deleteEvent(category, selectedKey, data);
      setData(next);
    }
    onSelect(null);
  };

  const deleteByKey = async (key: string) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    if (typeof (onDeleteProp) === 'function') {
      const next = await onDeleteProp(category, key) as DataStore;
      setData(next);
    } else {
      const next = deleteEvent(category, key, data);
      setData(next);
    }
    if (selectedKey === key) onSelect(null);
  };

  const inputBase = `w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`;
  const buttonBase = `px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'text-white' : ''}`;

  return (
    <div className={`rounded-xl brand-card p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} w-28`}>Kategori</label>
            <select className={inputBase} value={category} onChange={(e) => { setCategory(e.target.value as CategoryKey); onSelect(null); }}>
              <option value="analizler">Analizler</option>
              <option value="etkinlikler">Etkinlikler</option>
              <option value="haberler">Haberler</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} w-28`}>Kayıtlar</label>
            <select className={inputBase} value={selectedKey || ''} onChange={(e) => onSelect(e.target.value || null)}>
              <option value="">Yeni kayıt</option>
              {list.map(ev => (
                <option key={ev.date} value={ev.date}>{ev.date} — {ev.description.slice(0, 40)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} w-28`}>Arama</label>
            <input className={inputBase} placeholder="tarih veya açıklama" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <label className={`${isDark ? 'text-gray-300' : 'text-gray-700'} w-28`}>Ay/Yıl</label>
            <div className="grid grid-cols-2 gap-2 w-full">
              <select className={inputBase} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
                <option value="">Tüm Aylar</option>
                {turkishMonths.map((m, i) => (
                  <option key={m} value={String(i + 1)}>{m}</option>
                ))}
              </select>
              <select className={inputBase} value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                <option value="">Tüm Yıllar</option>
                {/* Derlenen yıllar */}
                {Array.from(new Set(list.map(ev => new Date(ev.date).getFullYear()))).sort().map(y => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} max-h-80 overflow-auto border ${isDark ? 'border-gray-700' : 'border-gray-200'} brand-card` }>
            {filtered.length === 0 ? (
              <div className={`p-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Kayıt bulunamadı</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {filtered.map(ev => (
                  <li key={ev.date} className="p-3 flex items-start justify-between gap-3">
                    <div className={`${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      <div className="text-sm font-medium">{ev.date}</div>
                      <div className="text-xs opacity-80">{ev.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className={`${buttonBase} ${isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-500 text-white'}`} onClick={() => onSelect(ev.date)}>Düzenle</button>
                      <button className={`${buttonBase} ${isDark ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600 hover:bg-red-500 text-white'}`} onClick={() => deleteByKey(ev.date)}>Sil</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className={`block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Tarih</label>
            <input className={inputBase} type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className={`block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Açıklama</label>
            <textarea className={inputBase} rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className={`block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Link (opsiyonel)</label>
            <input className={inputBase} placeholder="https://..." value={form.link || ''} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <input id="is_new" type="checkbox" className="h-4 w-4" checked={!!form.is_new} onChange={(e) => setForm(f => ({ ...f, is_new: e.target.checked }))} />
            <label htmlFor="is_new" className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Yeni</label>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="font-medium mb-2">Önizleme</div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              {form.date ? (
                <>
                  <div className="text-sm">{new Date(form.date).getDate()} {form.date ? turkishMonths[new Date(form.date).getMonth()] : ''}</div>
                  <div className="text-sm opacity-80">{form.description || 'Açıklama giriniz'}</div>
                </>
              ) : <div className="text-sm opacity-60">Tarih seçiniz</div>}
            </div>
          </div>

          <div className="flex gap-3">
                      <button className={`${buttonBase} ${isDark ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-500 text-white'}`} onClick={onSave}>Kaydet</button>
            <button className={`${buttonBase} ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-600 hover:bg-gray-500 text-white'}`} onClick={() => onSelect(null)}>Yeni</button>
            <button className={`${buttonBase} ${isDark ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600 hover:bg-red-500 text-white'}`} onClick={handleDelete} disabled={!selectedKey}>Sil</button>
          </div>
        </div>
      </div>
    </div>
  );
};



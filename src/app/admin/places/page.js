'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminPlaces() {
  const { places } = useAppData();
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Place' },
    { key: 'city', label: 'City' },
    { key: 'duration', label: 'Duration' },
    { key: 'hours', label: 'Hours' },
    { key: 'mustVisit', label: 'Must Visit', render: (v) => v ? '★' : '—' },
  ];

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
  };

  const handleDelete = async (row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await deleteDoc(doc(db, 'places', row.id));
      } catch (e) {
        alert('Failed to delete');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingRow || !editingRow.id) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'places', editingRow.id), formData);
      setEditingRow(null);
    } catch (e) {
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Places</h1>
          <p className="page-subtitle">{places?.length || 0} destinations</p>
        </div>
        <button className="btn btn--primary" onClick={() => alert('Add coming soon')}><Plus size={15} /> Add Place</button>
      </div>
      <AdminTable columns={columns} data={places || []} onEdit={handleEdit} onDelete={handleDelete} />

      {editingRow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="paper-card" style={{ width: '90%', maxWidth: '400px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Edit Place</h3>
              <button onClick={() => setEditingRow(null)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input style={{ padding: '8px', border: '1px solid #ddd' }} placeholder="Place Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input style={{ padding: '8px', border: '1px solid #ddd' }} placeholder="City" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Duration (e.g. 2 hours)" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Hours (e.g. 9AM-5PM)" value={formData.hours || ''} onChange={e => setFormData({...formData, hours: e.target.value})} />
              </div>
              
              <textarea style={{ padding: '8px', border: '1px solid #ddd', minHeight: '80px' }} placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              <input style={{ padding: '8px', border: '1px solid #ddd' }} placeholder="Google Maps URL" value={formData.mapUrl || ''} onChange={e => setFormData({...formData, mapUrl: e.target.value})} />
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={!!formData.mustVisit} onChange={e => setFormData({...formData, mustVisit: e.target.checked})} />
                Must Visit
              </label>

              <div className="flex-between" style={{ marginTop: '12px' }}>
                <button type="button" onClick={() => setEditingRow(null)} className="btn btn--secondary">Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

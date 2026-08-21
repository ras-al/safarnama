'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminHotels() {
  const { hotels } = useAppData();
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Hotel' },
    { key: 'city', label: 'City' },
    { key: 'phone', label: 'Phone' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'checkIn', label: 'Check-in', render: (v) => v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-' },
    { key: 'checkOut', label: 'Check-out', render: (v) => v ? new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-' },
  ];

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
  };

  const handleDelete = async (row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await deleteDoc(doc(db, 'hotels', row.id));
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
      await updateDoc(doc(db, 'hotels', editingRow.id), formData);
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
          <h1 className="page-title">Hotels</h1>
          <p className="page-subtitle">{hotels?.length || 0} hotels booked</p>
        </div>
        <button className="btn btn--primary" onClick={() => alert('Add coming soon')}><Plus size={15} /> Add Hotel</button>
      </div>
      <AdminTable columns={columns} data={hotels || []} onEdit={handleEdit} onDelete={handleDelete} />

      {editingRow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="paper-card" style={{ width: '90%', maxWidth: '400px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Edit Hotel</h3>
              <button onClick={() => setEditingRow(null)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input style={{ padding: '8px', border: '1px solid #ddd' }} placeholder="Hotel Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="City" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <input style={{ padding: '8px', border: '1px solid #ddd' }} placeholder="Rooms (e.g. Quad Sharing)" value={formData.rooms || ''} onChange={e => setFormData({...formData, rooms: e.target.value})} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} type="date" placeholder="Check-in" value={formData.checkIn || ''} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} type="date" placeholder="Check-out" value={formData.checkOut || ''} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="WiFi Name" value={formData.wifiName || ''} onChange={e => setFormData({...formData, wifiName: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="WiFi Pass" value={formData.wifiPass || ''} onChange={e => setFormData({...formData, wifiPass: e.target.value})} />
              </div>
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

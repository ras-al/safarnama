'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminTransport() {
  const { transport } = useAppData();
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { key: 'type', label: 'Type', render: (v) => <span className="stamp stamp--blue" style={{ transform: 'none', fontSize: '0.6rem' }}>{v}</span> },
    { key: 'name', label: 'Name' },
    { key: 'number', label: 'Number' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'date', label: 'Date' },
    { key: 'departure', label: 'Dep' },
    { key: 'arrival', label: 'Arr' },
    { key: 'pnr', label: 'PNR' },
  ];

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
  };

  const handleDelete = async (row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await deleteDoc(doc(db, 'transport', row.id));
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
      await updateDoc(doc(db, 'transport', editingRow.id), formData);
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
          <h1 className="page-title">Transport</h1>
          <p className="page-subtitle">{transport?.length || 0} journey legs</p>
        </div>
        <button className="btn btn--primary" onClick={() => alert('Add coming soon')}><Plus size={15} /> Add Transport</button>
      </div>
      <AdminTable columns={columns} data={transport || []} onEdit={handleEdit} onDelete={handleDelete} />

      {editingRow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="paper-card" style={{ width: '90%', maxWidth: '500px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Edit Transport</h3>
              <button onClick={() => setEditingRow(null)} style={{ background: 'none', border: 'none' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Type (e.g. Train)" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} />
                <input style={{ flex: 2, padding: '8px', border: '1px solid #ddd' }} placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Number" value={formData.number || ''} onChange={e => setFormData({...formData, number: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="From" value={formData.from || ''} onChange={e => setFormData({...formData, from: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="To" value={formData.to || ''} onChange={e => setFormData({...formData, to: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Date (YYYY-MM-DD)" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Departure" value={formData.departure || ''} onChange={e => setFormData({...formData, departure: e.target.value})} />
                <input style={{ flex: 1, padding: '8px', border: '1px solid #ddd' }} placeholder="Arrival" value={formData.arrival || ''} onChange={e => setFormData({...formData, arrival: e.target.value})} />
              </div>
              <input style={{ padding: '8px', border: '1px solid #ddd' }} placeholder="PNR" value={formData.pnr || ''} onChange={e => setFormData({...formData, pnr: e.target.value})} />
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

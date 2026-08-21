'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

export default function AdminParticipants() {
  const { participants } = useAppData();
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'group', label: 'Group' },
    { key: 'room', label: 'Room' },
    { key: 'coach', label: 'Coach' },
    { key: 'seat', label: 'Seat' },
  ];

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingRow || !editingRow.id) return;
    
    setIsSaving(true);
    try {
      const ref = doc(db, 'participants', editingRow.id);
      await updateDoc(ref, formData);
      setEditingRow(null);
    } catch (error) {
      console.error('Error updating participant:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await deleteDoc(doc(db, 'participants', row.id));
      } catch (e) {
        alert('Failed to delete');
      }
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Participants</h1>
          <p className="page-subtitle">{participants?.length || 0} students</p>
        </div>
        <button className="btn btn--primary" onClick={() => alert('Add feature coming soon')}><Plus size={15} /> Add Participant</button>
      </div>
      <AdminTable 
        columns={columns} 
        data={participants || []} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
      />

      {editingRow && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="paper-card" style={{ width: '90%', maxWidth: '400px', padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Edit Participant</h3>
              <button onClick={() => setEditingRow(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-faded)' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Name</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Phone</label>
                <input 
                  type="text" 
                  value={formData.phone || ''} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Group</label>
                  <input 
                    type="text" 
                    value={formData.group || ''} 
                    onChange={e => setFormData({...formData, group: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Room</label>
                  <input 
                    type="text" 
                    value={formData.room || ''} 
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Coach</label>
                  <input 
                    type="text" 
                    value={formData.coach || ''} 
                    onChange={e => setFormData({...formData, coach: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Seat</label>
                  <input 
                    type="text" 
                    value={formData.seat || ''} 
                    onChange={e => setFormData({...formData, seat: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  />
                </div>
              </div>

              <div className="flex-between">
                <button type="button" onClick={() => setEditingRow(null)} className="btn btn--secondary" disabled={isSaving}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

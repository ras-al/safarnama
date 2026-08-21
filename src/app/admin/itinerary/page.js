'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function AdminItinerary() {
  const { itinerary } = useAppData();
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const allActivities = itinerary.flatMap(day =>
    day.activities.map(a => ({ ...a, day: day.day, dayId: day.id, dayTitle: day.title, dayDate: day.date }))
  );

  const columns = [
    { key: 'day', label: 'Day' },
    { key: 'time', label: 'Time' },
    { key: 'title', label: 'Activity' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type', render: (v) => <span className={`stamp stamp--${v === 'visit' ? '' : 'blue'}`} style={{ transform: 'none', fontSize: '0.6rem' }}>{v}</span> },
  ];

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingRow || !editingRow.dayId || !editingRow.id) return;
    
    setIsSaving(true);
    try {
      // Find the specific day document from context
      const dayDoc = itinerary.find(d => d.id === editingRow.dayId);
      if (!dayDoc) throw new Error("Day not found");

      // Update the specific activity in the array
      const updatedActivities = dayDoc.activities.map(a => 
        a.id === editingRow.id ? {
          ...a,
          title: formData.title,
          time: formData.time,
          location: formData.location,
          type: formData.type,
          description: formData.description || ''
        } : a
      );

      // Update Firestore
      const ref = doc(db, 'itinerary', editingRow.dayId);
      await updateDoc(ref, { activities: updatedActivities });
      setEditingRow(null);
    } catch (error) {
      console.error('Error updating itinerary:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Itinerary</h1>
          <p className="page-subtitle">{allActivities.length} activities across {itinerary?.length || 0} days</p>
        </div>
        <button className="btn btn--primary" onClick={() => alert('Add feature coming soon')}><Plus size={15} /> Add Activity</button>
      </div>
      <AdminTable 
        columns={columns} 
        data={allActivities} 
        onEdit={handleEdit} 
      />

      {editingRow && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="paper-card" style={{ width: '90%', maxWidth: '400px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)' }}>Edit Activity (Day {editingRow.day})</h3>
              <button onClick={() => setEditingRow(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-faded)' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Title</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  required
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10:30 AM"
                    value={formData.time || ''} 
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Type</label>
                  <select 
                    value={formData.type || 'visit'} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  >
                    <option value="visit">Visit</option>
                    <option value="transport">Transport</option>
                    <option value="leisure">Leisure</option>
                    <option value="hotel">Hotel</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Location</label>
                <input 
                  type="text" 
                  value={formData.location || ''} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--ink-dark)' }}>Description</label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '4px', background: 'var(--paper-white)', minHeight: '80px' }}
                />
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

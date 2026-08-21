'use client';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus } from 'lucide-react';

export default function AdminPlaces() {
  const { places } = useAppData();
  const columns = [
    { key: 'name', label: 'Place' },
    { key: 'city', label: 'City' },
    { key: 'duration', label: 'Duration' },
    { key: 'hours', label: 'Hours' },
    { key: 'mustVisit', label: 'Must Visit', render: (v) => v ? '★' : '—' },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div><h1 className="page-title">Places</h1><p className="page-subtitle">{places.length} destinations</p></div>
        <button className="btn btn--primary"><Plus size={15} /> Add Place</button>
      </div>
      <AdminTable columns={columns} data={places} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

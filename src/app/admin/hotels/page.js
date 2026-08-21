'use client';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus } from 'lucide-react';

export default function AdminHotels() {
  const { hotels } = useAppData();
  const columns = [
    { key: 'name', label: 'Hotel' },
    { key: 'city', label: 'City' },
    { key: 'phone', label: 'Phone' },
    { key: 'rooms', label: 'Rooms' },
    { key: 'checkIn', label: 'Check-in', render: (v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
    { key: 'checkOut', label: 'Check-out', render: (v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div><h1 className="page-title">Hotels</h1><p className="page-subtitle">{hotels.length} hotels booked</p></div>
        <button className="btn btn--primary"><Plus size={15} /> Add Hotel</button>
      </div>
      <AdminTable columns={columns} data={hotels} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

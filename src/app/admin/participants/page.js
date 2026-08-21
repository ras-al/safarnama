'use client';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus } from 'lucide-react';

export default function AdminParticipants() {
  const { participants } = useAppData();
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'group', label: 'Group' },
    { key: 'room', label: 'Room' },
    { key: 'coach', label: 'Coach' },
    { key: 'seat', label: 'Seat' },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div><h1 className="page-title">Participants</h1><p className="page-subtitle">{participants.length} students</p></div>
        <button className="btn btn--primary"><Plus size={15} /> Add Participant</button>
      </div>
      <AdminTable columns={columns} data={participants} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

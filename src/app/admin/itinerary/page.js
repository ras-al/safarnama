'use client';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus } from 'lucide-react';

export default function AdminItinerary() {
  const { itinerary } = useAppData();

  const allActivities = itinerary.flatMap(day =>
    day.activities.map(a => ({ ...a, day: day.day, dayTitle: day.title, dayDate: day.date }))
  );

  const columns = [
    { key: 'day', label: 'Day' },
    { key: 'time', label: 'Time' },
    { key: 'title', label: 'Activity' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type', render: (v) => <span className={`stamp stamp--${v === 'visit' ? '' : 'blue'}`} style={{ transform: 'none', fontSize: '0.6rem' }}>{v}</span> },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Itinerary</h1>
          <p className="page-subtitle">{allActivities.length} activities across {itinerary.length} days</p>
        </div>
        <button className="btn btn--primary"><Plus size={15} /> Add Activity</button>
      </div>
      <AdminTable columns={columns} data={allActivities} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

'use client';
import { useAppData } from '@/lib/DataProvider';
import AdminTable from '@/components/AdminTable';
import { Plus } from 'lucide-react';

export default function AdminTransport() {
  const { transport } = useAppData();

  const columns = [
    { key: 'type', label: 'Type', render: (v) => <span className="stamp stamp--blue" style={{ transform: 'none', fontSize: '0.6rem' }}>{v}</span> },
    { key: 'name', label: 'Name' },
    { key: 'number', label: 'Number' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'date', label: 'Date' },
    { key: 'departure', label: 'Dep' },
    { key: 'pnr', label: 'PNR' },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Transport</h1>
          <p className="page-subtitle">{transport.length} journey legs</p>
        </div>
        <button className="btn btn--primary"><Plus size={15} /> Add Transport</button>
      </div>
      <AdminTable columns={columns} data={transport} onEdit={() => {}} onDelete={() => {}} />
    </div>
  );
}

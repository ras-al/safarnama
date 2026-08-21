'use client';
import styles from './table.module.css';

export default function AdminTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className={styles.th}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className={styles.tr}>
              {columns.map(col => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className={styles.td}>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className={styles.editBtn}>Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className={styles.deleteBtn}>Delete</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

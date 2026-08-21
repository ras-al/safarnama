'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import { Train, Download, ChevronDown, ChevronUp, FileText, Search } from 'lucide-react';
import styles from './tickets.module.css';

const routeLabels = {
  'ERS-AGRA': { label: 'Ernakulam → Agra', date: 'Aug 22', color: '#e74c3c' },
  'NDLS-SVDK': { label: 'Delhi → SVDK', date: 'Aug 25', color: '#3498db' },
  'SVDK-SINA': { label: 'SVDK → Srinagar', date: 'Aug 26', color: '#2ecc71' },
  'SINA-JAMMU': { label: 'Srinagar → Jammu', date: 'Aug 29', color: '#9b59b6' },
  'JAMMU-AMRITSAR ': { label: 'Jammu → Amritsar', date: 'Aug 29', color: '#e67e22' },
  'AMRITSAR-DELHI': { label: 'Amritsar → Delhi', date: 'Aug 30', color: '#1abc9c' },
  'DELHI-JAISALMER': { label: 'Delhi → Jaisalmer', date: 'Aug 31', color: '#f39c12' },
  'JAI-AHM': { label: 'Jaisalmer → Ahmedabad', date: 'Sep 02', color: '#e74c3c' },
  'AHMEDABAD-KOLLAM': { label: 'Ahmedabad → Kollam', date: 'Sep 04', color: '#2c3e50' },
};

export default function TicketsPage() {
  const { documents } = useAppData();
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [search, setSearch] = useState('');

  const tickets = (documents || []).filter(d => d.category === 'transport');
  const officialDocs = (documents || []).filter(d => d.category === 'official');

  // Filter by search (Route name OR Passenger name)
  const query = search.toLowerCase();
  
  const ticketsByRoute = {};
  let totalVisibleTickets = 0;

  tickets.forEach(t => {
    const route = t.route || 'Other';
    const info = routeLabels[route];
    const routeLabel = (info?.label || route).toLowerCase();
    
    // Check if route matches OR any passenger matches
    const matchesRoute = routeLabel.includes(query);
    const matchesPassenger = t.passengers?.some(p => p.toLowerCase().includes(query));
    
    if (!query || matchesRoute || matchesPassenger) {
      if (!ticketsByRoute[route]) ticketsByRoute[route] = [];
      ticketsByRoute[route].push(t);
      totalVisibleTickets++;
    }
  });

  const filteredRoutes = Object.entries(ticketsByRoute);

  return (
    <div className="page-container">
      <h1 className="page-title">Train Tickets</h1>
      <p className="page-subtitle">{totalVisibleTickets} tickets across {filteredRoutes.length} routes</p>

      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search your name or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Official Docs Quick Access */}
      <div className={styles.officialRow}>
        {officialDocs.map(doc => (
          <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className={styles.officialChip}>
            <FileText size={14} />
            <span>{doc.name}</span>
          </a>
        ))}
      </div>

      {/* Route Groups */}
      <div className={styles.routeList}>
        {filteredRoutes.map(([route, routeTickets]) => {
          const info = routeLabels[route] || { label: route, date: '', color: '#666' };
          // Auto-expand if searching and found matches
          const isExpanded = expandedRoute === route || (search.length > 0 && routeTickets.length > 0);

          return (
            <div key={route} className={styles.routeCard}>
              <button
                className={styles.routeHeader}
                onClick={() => setExpandedRoute(isExpanded && !search ? null : route)}
              >
                <div className={styles.routeLeft}>
                  <div className={styles.routeIcon} style={{ background: info.color }}>
                    <Train size={16} color="white" />
                  </div>
                  <div>
                    <h3 className={styles.routeName}>{info.label}</h3>
                    <div className={styles.routeMeta}>
                      <span>{info.date}</span>
                      <span className={styles.routeCount}>{routeTickets.length} tickets</span>
                    </div>
                  </div>
                </div>
                <div className={styles.routeChevron}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isExpanded && (
                <div className={styles.ticketList}>
                  {routeTickets.map((ticket, i) => (
                    <a
                      key={ticket.id}
                      href={ticket.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.ticketItem}
                    >
                      <div className={styles.ticketInfo}>
                        <div className={styles.ticketMain}>
                          <span className={styles.ticketNum}>#{i + 1}</span>
                          <span className={styles.ticketPnr}>{ticket.pnr || 'PNR N/A'}</span>
                        </div>
                        <div className={styles.ticketNames}>
                          {ticket.passengers && ticket.passengers.length > 0 
                            ? ticket.passengers.join(', ')
                            : 'No names found'}
                        </div>
                      </div>
                      <Download size={14} className={styles.ticketDl} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

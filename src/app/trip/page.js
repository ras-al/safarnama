'use client';
import { useState } from 'react';
import { useAppData } from '@/lib/DataProvider';
import {
  MapPin, Clock, Train, Utensils, Building2,
  Eye, Coffee, Briefcase, ChevronDown, ChevronUp
} from 'lucide-react';
import styles from './itinerary.module.css';

const typeIcons = {
  transport: Train,
  meal: Utensils,
  hotel: Building2,
  visit: Eye,
  free: Coffee,
  industry: Briefcase,
};

const typeColors = {
  transport: 'var(--ink-blue)',
  meal: 'var(--mustard)',
  hotel: 'var(--olive)',
  visit: 'var(--terracotta)',
  free: 'var(--kraft-dark)',
  industry: 'var(--ink-blue)',
};

export default function ItineraryPage() {
  const { itinerary, trip } = useAppData();
  const [selectedDay, setSelectedDay] = useState(trip.currentDay);
  const [expandedId, setExpandedId] = useState(null);

  const dayData = itinerary.find(d => d.day === selectedDay);

  return (
    <div>
      {/* Day Tabs */}
      <div className="day-tabs">
        {itinerary.map(d => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`day-tab ${d.day === selectedDay ? 'day-tab--active' : ''}`}
          >
            Day {String(d.day).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Day Header */}
      {dayData && (
        <div key={selectedDay} className={styles.pageTurn} style={{ perspective: 1000 }}>
          <div className={styles.dayHeader}>
            <div className={styles.dayHeaderContent}>
              <h2 className={styles.dayTitle}>{dayData.title}</h2>
              <div className={styles.dayMeta}>
                <MapPin size={13} />
                <span>{dayData.location}</span>
                <span className={styles.dayDate}>
                  {new Date(dayData.date).toLocaleDateString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short'
                  })}
                </span>
              </div>
            </div>
            {dayData.day === trip.currentDay && (
              <span className="stamp">Today</span>
            )}
          </div>

          {/* Timeline */}
          <div className="timeline">
            {dayData.activities.map((activity, idx) => {
              const Icon = typeIcons[activity.type] || Eye;
              const color = typeColors[activity.type] || 'var(--ink-faded)';
              const isExpanded = expandedId === activity.id;
              const requiresCheckIn = ['visit', 'industry'].includes(activity.type);

              return (
                <div key={activity.id} className="timeline__item">
                  <div
                    className="timeline__dot"
                    style={{ background: color }}
                  />

                  <div className={styles.activityCard}>
                    <button
                      className={styles.activityCardBtn}
                      style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}
                      onClick={() => setExpandedId(isExpanded ? null : activity.id)}
                    >
                      <div className={styles.activityHeader}>
                        <div className="timeline__time">{activity.time}</div>
                        <div className={styles.activityType} style={{ color }}>
                          <Icon size={13} />
                        </div>
                      </div>

                      <h3 className={styles.activityTitle}>{activity.title}</h3>

                      <div className={styles.activityLocation}>
                        <MapPin size={12} />
                        <span>{activity.location}</span>
                      </div>

                      {activity.description && (
                        <div className={styles.activityExpand}>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      )}

                      {isExpanded && activity.description && (
                        <p className={styles.activityDesc}>{activity.description}</p>
                      )}
                    </button>
                    
                    {isExpanded && requiresCheckIn && (
                       <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--kraft)', display: 'flex', justifyContent: 'flex-end' }}>
                         <button className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                           Check In
                         </button>
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

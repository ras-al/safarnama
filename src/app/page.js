'use client';
import { useAppData } from '@/lib/DataProvider';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import {
  MapPin, Clock, Train, ChevronRight, Sun,
  Cloud, Thermometer, Users, CalendarDays, Navigation, User
} from 'lucide-react';
import MapWrapper from '@/components/MapWrapper';
import styles from './home.module.css';

function useCountdown(targetDate, targetTime) {
  const [diff, setDiff] = useState(null);
  useEffect(() => {
    if (!targetDate || !targetTime) return;
    
    // Convert "10:30 AM" to 24h format
    let [time, modifier] = targetTime.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    
    const target = new Date(`${targetDate}T${hours.toString().padStart(2, '0')}:${minutes}:00`);
    
    const update = () => {
      const now = new Date();
      const ms = target - now;
      if (ms <= 0) { setDiff(null); return; }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setDiff({ h, m, s, total: ms });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate, targetTime]);
  return diff;
}

const cityCoordinates = {
  "Ernakulam": [9.9816, 76.2999],
  "On Train": [28.2045, 76.8251],
  "Agra": [27.1767, 78.0081],
  "Delhi": [28.6139, 77.2090],
  "Srinagar": [34.0837, 74.7973],
  "Sonmarg": [34.3032, 75.2829],
  "Pahalgam": [34.0150, 75.3268],
  "Amritsar": [31.6340, 74.8723],
  "Jaisalmer": [26.9157, 70.9083],
  "Ahmedabad": [23.0225, 72.5714],
  "Trivandrum": [8.5241, 76.9366]
};

export default function HomePage() {
  const data = useAppData();
  const { trip, itinerary, transport, announcements, participants } = data;
  
  const [selectedUser, setSelectedUser] = useState('');
  const [duration, setDuration] = useState('15');
  const [isSharing, setIsSharing] = useState(false);
  const [activeLocations, setActiveLocations] = useState({});
  const [myLocation, setMyLocation] = useState(null);
  const [currentCity, setCurrentCity] = useState('');
  const watchIdRef = useRef(null);

  useEffect(() => {
    // Load identity
    const savedId = localStorage.getItem('safarnama_identity');
    if (savedId) {
      setSelectedUser(savedId);
    }

    // Try to get user's actual location for the map center
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setMyLocation([pos.coords.latitude, pos.coords.longitude]);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=en`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.state || '';
              setCurrentCity(city);
            }
          } catch (e) {
            console.error('Geocoding failed');
          }
        },
        (err) => console.log('GPS not available for default map center', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    const unsub = onSnapshot(collection(db, 'locations'), (snapshot) => {
      const locs = {};
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d.active && new Date(d.expiresAt) > new Date()) {
          locs[d.name] = d;
        }
      });
      setActiveLocations(locs);
    });
    return () => unsub();
  }, []);


  const currentDayData = itinerary.find(d => d.day === trip.currentDay);
  const nextDay = itinerary.find(d => d.day === trip.currentDay + 1);

  const locationMarkers = Object.values(activeLocations).map(loc => ({
    position: [loc.lat, loc.lng],
    popup: loc.name
  }));
  const defaultCityCenter = cityCoordinates[currentDayData?.location?.split(',')[0]?.trim()] || cityCoordinates['Ernakulam'];
  const mapCenter = locationMarkers.length > 0 ? locationMarkers[0].position : (myLocation || defaultCityCenter);

  let mapMarkers = locationMarkers.length > 0 ? locationMarkers : [];
  if (mapMarkers.length === 0) {
    if (myLocation) {
      mapMarkers = [{ position: myLocation, popup: 'Your Current Location' }];
    } else {
      mapMarkers = [{ position: defaultCityCenter, popup: currentDayData?.location || 'Scheduled Location' }];
    }
  }

  // Find next upcoming activity
  const now = new Date();
  const todayActivities = currentDayData?.activities || [];
  const nextActivity = todayActivities.find(a => {
    const [h, m] = a.time.split(':');
    const actTime = new Date();
    actTime.setHours(parseInt(h), parseInt(m), 0);
    return actTime > now;
  }) || todayActivities[todayActivities.length - 1];

  // Next transport
  const nextTransport = transport[0];
  const countdown = useCountdown(nextTransport?.date, nextTransport?.departure);

  // Latest announcement
  const latestAnn = announcements[announcements.length - 1];

  return (
    <div className="page-container">
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Safarnama</h1>
            <p className={styles.tagline}>Department of CSE TKMCE</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className={styles.dayBadge}>
              <span className={styles.dayNumber}>Day {trip.currentDay}</span>
              <span className={styles.dayTotal}>of {trip.totalDays}</span>
            </div>
            <button 
              onClick={() => {
                if (confirm('Do you want to change your identity?')) {
                  localStorage.removeItem('safarnama_identity');
                  window.location.reload();
                }
              }}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-faded)', border: '1px solid var(--kraft)' }}
              title="Change Identity"
            >
              <User size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div
            className={styles.progressBar}
            style={{ width: `${(trip.currentDay / trip.totalDays) * 100}%` }}
          />
          {Array.from({ length: trip.totalDays }, (_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i < trip.currentDay ? styles.progressDotDone : ''}`}
              style={{ left: `${((i + 0.5) / trip.totalDays) * 100}%` }}
            />
          ))}
        </div>
      </header>

      {/* Current Location */}
      <section className={styles.locationCard} style={{ display: 'block' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={styles.locationPin}>
              <MapPin size={18} />
            </div>
            <div>
              <p className={styles.locationLabel}>You are in</p>
              <h2 className={styles.locationName}>{currentCity || currentDayData?.location || 'Unknown'}</h2>
              <p className={styles.locationDay}>Today's schedule: {currentDayData?.location}</p>
            </div>
          </div>
          <div className={styles.weatherChip}>
            <Sun size={16} />
            <span>32°C</span>
          </div>
        </div>
        
        {/* OpenStreetMap Integration */}
        <div className="polaroid" style={{ marginTop: '16px' }}>
          <div style={{ height: '180px', borderRadius: '2px', overflow: 'hidden', filter: 'sepia(0.4) contrast(0.9) hue-rotate(-10deg)' }}>
            <MapWrapper 
              center={mapCenter} 
              zoom={locationMarkers.length > 0 || myLocation ? 14 : 11}
              markers={mapMarkers}
            />
          </div>
          <div className="polaroid__caption">Safarnama 2026 Trail</div>
        </div>

        {/* Live Location Sharing */}
        <div style={{ marginTop: '16px', background: 'var(--cream-dark)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Share Live Location</p>
            <Link href="/location" style={{ fontSize: '0.7rem', color: 'var(--ink-blue)', textDecoration: 'underline' }}>View Others</Link>
          </div>
          {!isSharing ? (
            <div style={{ display: 'flex', gap: '6px' }}>
              <div 
                style={{ flex: 2, padding: '8px', borderRadius: '2px', border: '1px solid var(--kraft)', background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--ink-dark)' }}
              >
                {selectedUser || 'Loading...'}
              </div>
              <select 
                style={{ flex: 1, padding: '8px', borderRadius: '2px', border: '1px solid var(--kraft)', background: 'white' }}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hr</option>
              </select>
              <button 
                className="btn btn--primary" 
                style={{ padding: '8px 10px', flexShrink: 0 }}
                onClick={() => {
                  if (!selectedUser) {
                    alert('Identity not found. Please reload the app.');
                    return;
                  }
                  if (!navigator.geolocation) {
                    alert('Geolocation is not supported by your browser');
                    return;
                  }
                  
                  setIsSharing(true);
                  const durationMs = parseInt(duration) * 60000;
                  const exp = new Date(Date.now() + durationMs).toISOString();
                  
                  watchIdRef.current = navigator.geolocation.watchPosition(
                    async (pos) => {
                      try {
                        await setDoc(doc(db, 'locations', selectedUser), {
                          name: selectedUser,
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude,
                          timestamp: new Date().toISOString(),
                          expiresAt: exp,
                          active: true
                        });
                      } catch (err) {
                        console.error('Error sharing location:', err);
                      }
                    },
                    (err) => {
                      alert('Could not get your location. Please check your permissions.');
                      setIsSharing(false);
                      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
                    },
                    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                  );

                  // Auto stop when duration expires
                  setTimeout(() => {
                    setIsSharing(false);
                    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
                    setDoc(doc(db, 'locations', selectedUser), { active: false }, { merge: true }).catch(() => {});
                  }, durationMs);
                }}
              >
                <Navigation size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--olive)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span className="live-dot" style={{ width: 8, height: 8, background: 'var(--olive)', borderRadius: '50%', display: 'inline-block' }}></span>
                Sharing live location
              </div>
              <button 
                className="btn btn--secondary" 
                style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                onClick={async () => {
                  setIsSharing(false);
                  if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
                  try {
                    await setDoc(doc(db, 'locations', selectedUser), { active: false }, { merge: true });
                  } catch (e) {}
                  setSelectedUser('');
                }}
              >
                Stop
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Next Up */}
      <section className={styles.section}>
        <div className="section-divider">
          <span className="section-divider__line" />
          <span className="section-divider__label">Coming Up Next</span>
          <span className="section-divider__line" />
        </div>

        {nextActivity && (
          <div className={`paper-card ${styles.nextCard}`}>
            <div className={styles.nextCardTape} />
            <div className={styles.nextTime}>
              <Clock size={14} />
              <span>{nextActivity.time}</span>
            </div>
            <h3 className={styles.nextTitle}>{nextActivity.title}</h3>
            <p className={styles.nextLocation}>
              <MapPin size={13} />
              {nextActivity.location}
            </p>
            {nextActivity.description && (
              <p className={styles.nextDesc}>{nextActivity.description}</p>
            )}
            <Link href="/trip" className={`btn btn--secondary ${styles.nextBtn}`}>
              View Full Itinerary <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* Transport Ticket */}
      <section className={styles.section}>
        <div className="section-divider">
          <span className="section-divider__line" />
          <span className="section-divider__label">Next Journey</span>
          <span className="section-divider__line" />
        </div>

        {nextTransport && (
          <div className="ticket-stub">
            <div className={styles.ticketHeader}>
              <div className={styles.ticketType}>
                <Train size={16} />
                <span className="stamp stamp--blue">{nextTransport.type}</span>
              </div>
              <span className={styles.ticketNumber}>{nextTransport.number}</span>
            </div>
            <h3 className={styles.ticketName}>{nextTransport.name}</h3>
            <div className={styles.ticketRoute}>
              <div className={styles.ticketStation}>
                <span className={styles.stationCode}>{nextTransport.from}</span>
                <span className={styles.stationTime}>{nextTransport.departure}</span>
              </div>
              <div className={styles.ticketArrow}>
                <span className={styles.ticketDots} />
                <Navigation size={14} />
                <span className={styles.ticketDots} />
              </div>
              <div className={styles.ticketStation}>
                <span className={styles.stationCode}>{nextTransport.to}</span>
                {nextTransport.arrival && <span className={styles.stationTime}>{nextTransport.arrival}</span>}
              </div>
            </div>
            <div className={styles.ticketFooter} style={{ display: 'flex', justifyContent: 'center', padding: '12px 16px' }}>
              <Link href="/tickets" className="btn btn--secondary" style={{ width: '100%', justifyContent: 'center' }}>
                View Train Tickets
              </Link>
            </div>
            {countdown && (
              <div className="countdown-chip" style={{ marginTop: 12 }}>
                <Clock size={13} />
                Departs in {countdown.h}h {countdown.m}m {countdown.s}s
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className={styles.section}>
        <div className="section-divider">
          <span className="section-divider__line" />
          <span className="section-divider__label">Quick Access</span>
          <span className="section-divider__line" />
        </div>

        <div className={styles.quickGrid}>
          {[
            { href: '/trip', label: 'Itinerary', icon: CalendarDays, color: 'var(--terracotta)' },
            { href: '/trip/transport', label: 'Transport', icon: Train, color: 'var(--ink-blue)' },
            { href: '/trip/hotels', label: 'Hotels', icon: MapPin, color: 'var(--olive)' },
            { href: '/participants', label: 'Participants', icon: Users, color: 'var(--mustard)' },
          ].map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href} className={styles.quickItem}>
              <div className={styles.quickIcon} style={{ color }}>
                <Icon size={22} />
              </div>
              <span className={styles.quickLabel}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Announcement */}
      {latestAnn && (
        <section className={styles.section}>
          <div className="section-divider">
            <span className="section-divider__line" />
            <span className="section-divider__label">Latest Update</span>
            <span className="section-divider__line" />
          </div>

          <Link href="/announcements" className={`paper-card paper-card--tape ${styles.announcementCard}`}>
            <span className={`stamp ${latestAnn.priority === 'important' ? '' : 'stamp--olive'}`}>
              {latestAnn.priority === 'important' ? 'Important' : 'Notice'}
            </span>
            <h3 className={styles.annTitle}>{latestAnn.title}</h3>
            <p className={styles.annBody}>{latestAnn.body}</p>
            <p className={styles.annAuthor}>- {latestAnn.author}</p>
          </Link>
        </section>
      )}

      {/* Participants Count */}
      <section className={styles.statsRow}>
        <div className={styles.statItem}>
          <Users size={18} />
          <span className={styles.statNumber}>{participants?.length || trip.totalParticipants}</span>
          <span className={styles.statLabel}>Travellers</span>
        </div>
        <div className={styles.statItem}>
          <CalendarDays size={18} />
          <span className={styles.statNumber}>{trip.totalDays}</span>
          <span className={styles.statLabel}>Days</span>
        </div>
        <div className={styles.statItem}>
          <MapPin size={18} />
          <span className={styles.statNumber}>6</span>
          <span className={styles.statLabel}>Cities</span>
        </div>
      </section>
    </div>
  );
}

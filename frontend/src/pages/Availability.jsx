import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import api from '../utils/api';
import { 
  Search, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  HelpCircle, 
  Compass, 
  CalendarIcon,
  Sun
} from 'lucide-react';

const Availability = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vidwans, setVidwans] = useState([]);
  const [selectedVidwanId, setSelectedVidwanId] = useState('');
  const [vidwanProfile, setVidwanProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [freeWeekends, setFreeWeekends] = useState([]);

  // Fetch all Vidwans for selection on load
  useEffect(() => {
    const fetchVidwansList = async () => {
      try {
        const { data } = await api.get('/vidwans');
        // Only active Vidwans can be searched for availability
        const active = data.filter(v => v.status === 'Active');
        setVidwans(active);

        // Check if there is a query param
        const qId = searchParams.get('vidwanId');
        if (qId && active.some(v => v._id === qId)) {
          setSelectedVidwanId(qId);
        }
      } catch (err) {
        console.error('Error loading Vidwans', err);
      }
    };
    fetchVidwansList();
  }, [searchParams]);

  // Fetch selected Vidwan's availability details
  useEffect(() => {
    if (!selectedVidwanId) {
      setVidwanProfile(null);
      setBookings([]);
      setFreeWeekends([]);
      return;
    }

    const loadAvailability = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/vidwans/${selectedVidwanId}/availability`);
        setVidwanProfile(data.vidwan);
        setBookings(data.bookings);
        calculateFreeWeekends(data.bookings);
      } catch (err) {
        console.error('Error fetching availability', err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
    // Update URL query string
    setSearchParams({ vidwanId: selectedVidwanId });
  }, [selectedVidwanId, setSearchParams]);

  // Calculate free weekends over the next 60 days
  const calculateFreeWeekends = (currentBookings) => {
    const free = [];
    const today = new Date();
    
    // Normalize today to start of day
    today.setHours(0, 0, 0, 0);

    // Look ahead 60 days (approx 8-9 weeks)
    const lookAheadDays = 60;
    const datesToCheck = [];

    for (let i = 0; i < lookAheadDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      if (day === 6 || day === 0) {
        datesToCheck.push(date);
      }
    }

    // Group dates into weekend pairs
    const weekendPairs = [];
    let currentPair = {};

    datesToCheck.forEach((date) => {
      const day = date.getDay();
      const dateString = date.toDateString();

      // Check if this date falls within any booking range (inclusive)
      const isBooked = currentBookings.some((booking) => {
        const start = new Date(booking.startDate);
        start.setHours(0,0,0,0);
        const end = new Date(booking.endDate);
        end.setHours(23,59,59,999);
        return date >= start && date <= end;
      });

      if (day === 6) {
        // Saturday
        currentPair.saturday = { date, isBooked };
      } else if (day === 0) {
        // Sunday
        currentPair.sunday = { date, isBooked };
        weekendPairs.push(currentPair);
        currentPair = {}; // reset for next week
      }
    });

    // Process weekend pairs to find fully free weekends
    weekendPairs.forEach((pair) => {
      const sat = pair.saturday;
      const sun = pair.sunday;

      if (sat && sun) {
        if (!sat.isBooked && !sun.isBooked) {
          free.push({
            label: `${sat.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${sun.date.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`,
            dates: [sat.date, sun.date]
          });
        }
      }
    });

    setFreeWeekends(free);
  };

  // Convert bookings to FullCalendar events
  const calendarEvents = bookings.map((booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    
    // Set display end date time to 23:59:59 to visually block the last day correctly
    const displayEnd = new Date(end);
    displayEnd.setHours(23, 59, 59, 999);

    return {
      id: booking._id,
      title: `${booking.programName} (${booking.city})`,
      start: start,
      end: displayEnd,
      className: `event-${booking.status.toLowerCase()}`,
    };
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 p-6 lg:p-8 bg-cream overflow-y-auto h-screen">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold font-serif text-teak">Availability Search</h2>
        <p className="text-sm text-teak-light">Lookup scholar availability, view current commitments, and scan free weekends.</p>
      </div>

      {/* Select Scholar Bar */}
      <div className="bg-white p-6 rounded-2xl border border-cream-border mb-6 shadow-sm">
        <label className="text-xs font-bold text-teak uppercase tracking-wider block mb-2">
          Select Vidwan to Check
        </label>
        <div className="relative max-w-md">
          <select
            value={selectedVidwanId}
            onChange={(e) => setSelectedVidwanId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-cream/30 border border-cream-border rounded-xl text-sm font-medium text-teak focus:outline-none focus:border-saffron focus:bg-white appearance-none cursor-pointer"
          >
            <option value="">-- Choose an active Vidwan --</option>
            {vidwans.map((v) => (
              <option key={v._id} value={v._id}>{v.name} ({v.city})</option>
            ))}
          </select>
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-teak-muted pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
        </div>
      </div>

      {!selectedVidwanId ? (
        <div className="bg-white/60 p-16 rounded-2xl border border-cream-border text-center border-dashed">
          <Compass className="w-12 h-12 text-saffron/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-teak-light">
            Please choose a Vidwan above to analyze their schedule.
          </p>
        </div>
      ) : loading ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-cream-border">
          <div className="w-10 h-10 border-2 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-teak-muted">Analyzing schedule and mapping calendar...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar Info Panel */}
          <div className="space-y-6 lg:col-span-1">
            {/* Scholar Bio */}
            {vidwanProfile && (
              <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm">
                <h3 className="text-lg font-bold font-serif text-teak mb-2">{vidwanProfile.name}</h3>
                <p className="text-xs text-saffron font-medium mb-3">{vidwanProfile.specialization}</p>
                <div className="text-[11px] text-teak-light space-y-1.5 border-t border-cream-border pt-3">
                  <p><strong>Base City:</strong> {vidwanProfile.city}</p>
                  <p><strong>Languages:</strong> {vidwanProfile.languages.join(', ')}</p>
                  <p><strong>Travel boundaries:</strong> {vidwanProfile.travelCapability}</p>
                </div>
              </div>
            )}

            {/* Free Weekends Panel (VARY IMPORTANT) */}
            <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm">
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-teak mb-3 border-b border-cream-border pb-2 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-saffron" />
                <span>Free Weekends (60 Days)</span>
              </h3>
              
              {freeWeekends.length === 0 ? (
                <p className="text-xs text-teak-muted leading-relaxed">
                  No fully free weekends found in the next 60 days. All weekends have scheduled camps.
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {freeWeekends.map((weekend, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2.5 p-2.5 bg-forest-soft/40 border border-forest/10 rounded-lg"
                    >
                      <CalendarIcon className="w-4 h-4 text-forest flex-shrink-0" />
                      <span className="text-xs font-semibold text-forest-dark">{weekend.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List of Commitments */}
            <div className="bg-white p-5 rounded-2xl border border-cream-border shadow-sm">
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-teak mb-3 border-b border-cream-border pb-2">
                Active Bookings ({bookings.length})
              </h3>
              
              {bookings.length === 0 ? (
                <p className="text-xs text-teak-muted">
                  No active programs scheduled. Scholar is fully available.
                </p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {bookings.map((booking) => (
                    <div 
                      key={booking._id} 
                      className="p-3 bg-cream/40 border border-cream-border/60 rounded-xl space-y-1 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-teak">{booking.programName}</span>
                        {booking.status === 'Confirmed' ? (
                          <CheckCircle className="w-3.5 h-3.5 text-forest" />
                        ) : (
                          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <div className="text-teak-light flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teak-muted" />
                        <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                      </div>
                      <div className="text-teak-light flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teak-muted" />
                        <span>{booking.city}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calendar Display */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-cream-border shadow-sm">
            <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-teak mb-4 border-b border-cream-border pb-2">
              Scholar Commitments Calendar
            </h3>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth',
              }}
              events={calendarEvents}
              height="auto"
              editable={false}
              selectable={false}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default Availability;

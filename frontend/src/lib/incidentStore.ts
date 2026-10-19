/**
 * Sakhi Incident Store
 * Manages incident triage records with localStorage persistence and pre-seeded realistic cases.
 */

export interface IncidentRecord {
  id: string;
  name: string;
  phone?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: 'Very High' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Review' | 'Dispatched' | 'Resolved';
  situation: string;
  culpritDescription: string;
  durationOfAbuse?: string;
  frequency?: string;
  preferredContact: string[];
  encodedImageUrl?: string;
  decodedPayload?: string;
  timestamp: string;
  matchedPerpetratorProfile?: {
    matchRate: number;
    alias: string;
    previousIncidents: number;
  };
}

const SEED_INCIDENTS: IncidentRecord[] = [
  {
    id: 'HVN-8091',
    name: 'A. K. (Discreet)',
    phone: '+91 98721 44012',
    location: {
      lat: 28.6139,
      lng: 77.209,
      address: 'Central District, New Delhi',
    },
    severity: 'Very High',
    status: 'Pending',
    situation:
      'Immediate threat of physical confinement and escalation. Abuser has confiscated primary phone; communicating via tablet disguised as home decor social post.',
    culpritDescription: 'Male, approx 38 yrs, scar on right arm, works in logistics.',
    durationOfAbuse: '14 months',
    frequency: 'Daily verbal abuse, physical violence multiple times weekly',
    preferredContact: ['Text message', 'Discreet Signal'],
    timestamp: '12 mins ago',
    matchedPerpetratorProfile: {
      matchRate: 94,
      alias: 'Subject P-409 (Prior Protection Order File)',
      previousIncidents: 2,
    },
  },
  {
    id: 'HVN-8088',
    name: 'Meera S.',
    phone: '+91 91234 56780',
    location: {
      lat: 19.076,
      lng: 72.8777,
      address: 'Bandra West, Mumbai',
    },
    severity: 'High',
    status: 'In Review',
    situation:
      'Restraining order violation. Subject is loitering outside residence and demanding access to children.',
    culpritDescription: 'Male, 42 yrs, tall, dark jacket, driving silver sedan.',
    durationOfAbuse: '8 months',
    frequency: 'Repeated stalking and surveillance',
    preferredContact: ['In-person counselor', 'WhatsApp'],
    timestamp: '45 mins ago',
    matchedPerpetratorProfile: {
      matchRate: 88,
      alias: 'Subject M-112',
      previousIncidents: 1,
    },
  },
  {
    id: 'HVN-8079',
    name: 'Priyanka R.',
    phone: '+91 94451 09231',
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Indiranagar, Bengaluru',
    },
    severity: 'Medium',
    status: 'Dispatched',
    situation:
      'Financial deprivation and continuous verbal intimidation. Seeking emergency shelter consultation and legal aid referral.',
    culpritDescription: 'Family member, residing in same duplex.',
    durationOfAbuse: '2 years',
    frequency: 'Weekly escalations',
    preferredContact: ['Email', 'In-person'],
    timestamp: '2 hours ago',
  },
  {
    id: 'HVN-8064',
    name: 'Sunita D.',
    phone: '+91 99881 23419',
    location: {
      lat: 22.5726,
      lng: 88.3639,
      address: 'Salt Lake Sector 5, Kolkata',
    },
    severity: 'Low',
    status: 'Resolved',
    situation:
      'Case resolved. Legal counsel assigned via District Legal Services Authority (DLSA) and safe transitional shelter secured.',
    culpritDescription: 'Estranged spouse.',
    durationOfAbuse: '6 months',
    frequency: 'Intermittent harassment',
    preferredContact: ['Phone'],
    timestamp: '1 day ago',
  },
];

const STORAGE_KEY = 'haven_incidents_store';

export function getStoredIncidents(): IncidentRecord[] {
  if (typeof window === 'undefined') return SEED_INCIDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INCIDENTS));
      return SEED_INCIDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_INCIDENTS;
  }
}

export function saveIncident(incident: Omit<IncidentRecord, 'id' | 'timestamp'>): IncidentRecord {
  const all = getStoredIncidents();
  const newRecord: IncidentRecord = {
    ...incident,
    id: `HVN-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: 'Just now',
  };
  const updated = [newRecord, ...all];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return newRecord;
}

export function updateIncidentStatus(
  id: string,
  newStatus: IncidentRecord['status']
): IncidentRecord[] {
  const all = getStoredIncidents();
  const updated = all.map((item) =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

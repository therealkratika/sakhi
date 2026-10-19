'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'citizen' | 'responder';

export interface HavenUser {
  id: string;
  name: string;
  role: UserRole;
  badge?: string;
  isAnonymous: boolean;
}

interface HavenAuthContextType {
  user: HavenUser;
  role: UserRole;
  setRole: (role: UserRole) => void;
  stealthMode: boolean;
  setStealthMode: (enabled: boolean) => void;
  toggleStealthMode: () => void;
  switchUser: (name: string, role: UserRole) => void;
}

const defaultCitizen: HavenUser = {
  id: 'usr-cit-104',
  name: 'Discreet Citizen',
  role: 'citizen',
  isAnonymous: true,
};

const defaultResponder: HavenUser = {
  id: 'usr-rsp-402',
  name: 'Officer A. Sharma',
  role: 'responder',
  badge: 'HVN-8821',
  isAnonymous: false,
};

const HavenAuthContext = createContext<HavenAuthContextType | undefined>(
  undefined
);

export function HavenAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRoleState] = useState<UserRole>('citizen');
  const [user, setUser] = useState<HavenUser>(defaultCitizen);
  const [stealthMode, setStealthMode] = useState<boolean>(false);

  useEffect(() => {
    // Listen for Escape key to toggle stealth mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStealthMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'responder') {
      setUser(defaultResponder);
    } else {
      setUser(defaultCitizen);
    }
  };

  const switchUser = (name: string, newRole: UserRole) => {
    setRoleState(newRole);
    setUser({
      id: `usr-${Date.now()}`,
      name,
      role: newRole,
      badge: newRole === 'responder' ? 'HVN-OFFICER' : undefined,
      isAnonymous: false,
    });
  };

  const toggleStealthMode = () => {
    setStealthMode((prev) => !prev);
  };

  return (
    <HavenAuthContext.Provider
      value={{
        user,
        role,
        setRole,
        stealthMode,
        setStealthMode,
        toggleStealthMode,
        switchUser,
      }}
    >
      {stealthMode ? <StealthScreen onExit={() => setStealthMode(false)} /> : children}
    </HavenAuthContext.Provider>
  );
}

export function useHavenAuth() {
  const context = useContext(HavenAuthContext);
  if (!context) {
    throw new Error('useHavenAuth must be used within HavenAuthProvider');
  }
  return context;
}

// Neutral decoy screen for immediate physical safety (Stealth mode)
function StealthScreen({ onExit }: { onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-white text-slate-800 p-8 font-sans overflow-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              National Weather & Meteorological Bulletin
            </h1>
            <p className="text-sm text-slate-500">Updated: Today, 14:30 IST • Regional Forecast Service</p>
          </div>
          <button
            onClick={onExit}
            title="Resume Session"
            className="text-xs px-2.5 py-1 text-slate-400 hover:text-slate-700 border border-slate-200 rounded transition-colors"
          >
            Press Esc to resume
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Northern Plains</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">28°C</p>
            <p className="text-sm text-slate-600 mt-1">Clear skies, moderate winds from NW at 12 km/h.</p>
          </div>
          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Coastal Districts</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">31°C</p>
            <p className="text-sm text-slate-600 mt-1">Humid with patchy clouds along the shoreline.</p>
          </div>
          <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Deccan Plateau</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">26°C</p>
            <p className="text-sm text-slate-600 mt-1">Light evening showers expected in isolated pockets.</p>
          </div>
        </section>

        <section className="border border-slate-200 rounded-md p-6 bg-white space-y-3">
          <h2 className="text-base font-semibold text-slate-800">Synoptic Overview & Atmospheric Indicators</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A gentle cyclonic circulation lies over the west-central Bay of Bengal off the coastal margins. 
            Under its influence, widespread light to moderate rainfall with isolated heavy falls is very likely over the region during the next 48 hours. 
            Agricultural operations may proceed normally in the central and western zones. Barometric pressure remains steady at 1012 hPa.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Commuters and transport operators are advised to follow standard seasonal precautions. Air Quality Index (AQI) stands in the moderate range (84) across metropolitan reporting centers.
          </p>
        </section>
      </div>
    </div>
  );
}

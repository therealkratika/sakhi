'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './ModeToggle';
import { useHavenAuth } from '@/context/HavenAuthContext';
import {
  ShieldAlert,
  EyeOff,
  Radio,
  FileText,
  SlidersHorizontal,
  Compass,
  PhoneCall,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { role, setRole, toggleStealthMode } = useHavenAuth();

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const citizenNav = [
    { label: 'Overview', href: '/', icon: Compass },
    { label: 'Discreet SOS', href: '/create-post', icon: ShieldAlert },
    { label: 'Legal Rights', href: '/lawbot', icon: FileText },
    { label: 'Crisis Support', href: '/crisis', icon: PhoneCall },
  ];

  const responderNav = [
    { label: 'Overview', href: '/', icon: Compass },
    { label: 'Incident Dashboard', href: '/dashboard', icon: SlidersHorizontal },
    { label: 'Signal Decoder', href: '/decoder', icon: Radio },
  ];

  const navItems = role === 'responder' ? responderNav : citizenNav;

  return (
    <nav className="w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm tracking-wider">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100">
              SAKHI
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">
              Discreet Safety & Triage Network
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={14} className={active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Stealth / Quick Exit Button */}
        <button
          onClick={toggleStealthMode}
          title="Instant Stealth Screen (or press Esc)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors text-xs font-semibold"
        >
          <EyeOff size={14} />
          <span className="hidden sm:inline">Quick Exit</span>
          <span className="text-[10px] bg-rose-200/70 dark:bg-rose-900/80 px-1 py-0.2 rounded font-mono">
            Esc
          </span>
        </button>

        {/* Role Switcher */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded p-0.5 bg-slate-50 dark:bg-slate-800/60">
          <button
            onClick={() => setRole('citizen')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              role === 'citizen'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => setRole('responder')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              role === 'responder'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Responder
          </button>
        </div>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </nav>
  );
}

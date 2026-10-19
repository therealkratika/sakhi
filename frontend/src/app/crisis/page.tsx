'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  HeartHandshake,
  CheckCircle2,
  Copy,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useHavenAuth } from '@/context/HavenAuthContext';

interface Helpline {
  name: string;
  number: string;
  description: string;
  available: string;
  type: 'national' | 'police' | 'legal' | 'crisis';
}

const HELPLINES: Helpline[] = [
  {
    name: 'National Emergency Response System',
    number: '112',
    description: 'Unified pan-India emergency number for immediate police dispatch, fire, and ambulance rescue.',
    available: '24/7 • Toll-Free',
    type: 'police',
  },
  {
    name: 'National Women Helpline',
    number: '181',
    description: 'Government 24/7 helpline providing crisis intervention, emergency referral to one-stop crisis centers (OSCs), and hospital aid.',
    available: '24/7 • Toll-Free',
    type: 'national',
  },
  {
    name: 'Women in Distress (Police Patrol)',
    number: '1091',
    description: 'Dedicated police helpline for women in distress, stalking, domestic confinement, or physical threat.',
    available: '24/7 • Toll-Free',
    type: 'police',
  },
  {
    name: 'National Commission for Women (NCW)',
    number: '+91 78271 70170',
    description: 'NCW 24/7 domestic violence and emergency redressal hotline. Also supports WhatsApp complaints.',
    available: '24/7',
    type: 'crisis',
  },
  {
    name: 'NALSA Free Legal Aid Helpline',
    number: '15100',
    description: 'National Legal Services Authority helpline providing immediate free government lawyers for court petitions.',
    available: '24/7 • Toll-Free',
    type: 'legal',
  },
  {
    name: 'Childline (Endangered Children)',
    number: '1098',
    description: 'Emergency assistance for children caught in abusive households or facing physical/emotional violence.',
    available: '24/7 • Toll-Free',
    type: 'national',
  },
];

const SAFETY_CHECKLIST = [
  { id: 'docs', label: 'Essential Identity Documents', desc: 'Aadhaar, voter ID, PAN, passport, or clear phone scans stored in secure cloud or with a trusted third party.' },
  { id: 'bank', label: 'Financial Independence', desc: 'Separate personal bank account, emergency cash hidden outside the residence, ATM card.' },
  { id: 'evidence', label: 'Incidents & Injury Evidence', desc: 'Secure record of dates, times, medical examination sheets, photos of visible bruises, threat recordings.' },
  { id: 'kids', label: 'Children’s Safeguards', desc: 'Birth certificates, school records, immunization cards, medications in a quick-grab envelope.' },
  { id: 'safeword', label: 'Pre-Arranged Safe Word', desc: 'A neutral code phrase (e.g. "Did you buy the green tea?") agreed with a neighbor or friend meaning "Call the police to my house immediately."' },
];

export default function CrisisPage() {
  const { toggleStealthMode } = useHavenAuth();
  const [breathingStep, setBreathingStep] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    toast.success(`Copied ${num} to clipboard`);
  };

  // Grounding breathing cycle
  React.useEffect(() => {
    if (!isBreathingActive) return;
    const steps: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % steps.length;
      setBreathingStep(steps[currentIdx]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-rose-600">
              Emergency & Mental Support — Sakhi
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Verified Crisis Helplines & Safety Planning
            </h1>
          </div>
          <button
            onClick={toggleStealthMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
          >
            <EyeOff size={13} /> Quick Exit (Esc)
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Direct, verified access to round-the-clock emergency dispatch, statutory legal aid, shelter networks, and confidential support.
        </p>
      </div>

      {/* Verified Helplines Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            24/7 Verified Emergency Numbers
          </h2>
          <span className="text-xs font-mono text-slate-500">Government & Statutory Services</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HELPLINES.map((line, idx) => (
            <div
              key={idx}
              className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{line.available}</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {line.type}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {line.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {line.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-mono text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {line.number}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(line.number)}
                    title="Copy number"
                    className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  >
                    <Copy size={13} />
                  </button>
                  <a
                    href={`tel:${line.number}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800"
                  >
                    <PhoneCall size={12} /> Call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Planning & Grounding Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Safety Plan Checklist */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-slate-900 dark:text-slate-100" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Discreet Emergency Safety Protocol
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Recommended measures by domestic violence advocates if considering leaving or preparing for escalation:
          </p>

          <div className="space-y-3">
            {SAFETY_CHECKLIST.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {item.label}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Box Breathing & Grounding Tool */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <HeartHandshake size={18} className="text-slate-900 dark:text-slate-100" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Grounding & Heart-Rate Regulation
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Acute panic or fear triggers sympathetic overdrive. Box Breathing (used by first responders and trauma psychologists) slows autonomic heart rate within 90 seconds.
          </p>

          <div className="p-8 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-24 h-24 rounded-full border-4 border-slate-900 dark:border-slate-100 flex items-center justify-center font-bold text-sm tracking-wider text-slate-900 dark:text-slate-100 transition-all duration-1000">
              {isBreathingActive ? breathingStep : '4-4-4'}
            </div>

            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {isBreathingActive
                ? `Paced Cadence: ${breathingStep} for 4 seconds...`
                : 'Paced Inhale (4s) • Hold (4s) • Exhale (4s)'}
            </p>

            <button
              onClick={() => setIsBreathingActive((prev) => !prev)}
              className="px-4 py-2 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              {isBreathingActive ? 'Stop Exercise' : 'Start 4-4-4 Grounding'}
            </button>
          </div>

          <div className="p-3.5 rounded bg-slate-100/70 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Reminder:</span>
            <p>You are not alone. There are legally protected shelters, registered Protection Officers, and free lawyers ready to stand with you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

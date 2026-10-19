'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Radio,
  FileText,
  SlidersHorizontal,
  ArrowRight,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export default function Header() {

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-16">
      {/* Hero Section */}
      <div className="flex flex-col items-start gap-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          Discreet Protective Technology for Women
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
          A Silent Shield, <br />
          <span className="text-slate-600 dark:text-slate-400">A Strong Voice.</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          For victims living under intimate surveillance, ordinary communications carry severe risk. 
          Sakhi enables individuals to embed distress telemetry into innocuous social photos using 
          pixel-level steganography—connecting covertly to authorities, emergency responders, and legal advocates.
        </p>

        {/* Primary Action Buttons (Solid colors, ZERO gradients) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/create-post"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
          >
            <ShieldAlert size={16} />
            Create Discreet SOS
          </Link>

          <Link
            href="/decoder"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Radio size={16} />
            Inspect / Decode Image
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Incident Dashboard
          </Link>
        </div>

        {/* Safety Note banner */}
        <div className="w-full flex items-start gap-3 p-3.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400">
          <EyeOff size={16} className="text-slate-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Discreet Safety Assurance:</span>{' '}
            Need to quickly hide this page? Click the <strong>Quick Exit</strong> button in the top navigation or press the{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200">
              Esc
            </kbd>{' '}
            key at any time to instantly mask your screen with a benign meteorological bulletin.
          </div>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Core Capabilities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              End-to-end protective workflows engineered for high-risk domestic situations
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Secure & Encrypted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100">
                <ShieldAlert size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Discreet SOS Studio
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Generates a benign cover photo (nature, flowers, daily scenery) and embeds real GPS coordinates, incident descriptions, and perpetrator traits directly into image pixels.
              </p>
            </div>
            <Link
              href="/create-post"
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1 hover:underline"
            >
              Open SOS Studio <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100">
                <Radio size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Steganography Decoder
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Authority tool to inspect any suspected image, extract hidden bitstreams using reverse LSB algorithms, and ingest decoded cases straight into the live triage queue.
              </p>
            </div>
            <Link
              href="/decoder"
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1 hover:underline"
            >
              Test Decoder <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100">
                <SlidersHorizontal size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Incident Triage Center
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Real-time command center for first responders. Filter by urgency level, review perpetrator match similarity, and dispatch emergency support teams.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1 hover:underline"
            >
              View Active Queue <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-slate-100">
                <FileText size={18} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Legal Rights Advisor
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Confidential legal intelligence on Protection Orders (PWDVA Sec 18), rights against residence eviction (Sec 19), child custody, and free NALSA/DLSA legal aid.
              </p>
            </div>
            <Link
              href="/lawbot"
              className="text-xs font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1 hover:underline"
            >
              Consult Law Bot <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Security & Response Guide */}
      <div className="p-6 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-slate-900 dark:text-slate-100" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Platform Workflow & Security Guide
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">End-to-End Privacy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="space-y-1.5 p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200">1. Discreet Reporting</span>
            <p>Go to <strong>Discreet SOS</strong>, fill the simple incident form, select a cover photo, and download the encoded image. It seamlessly dispatches to the dashboard.</p>
          </div>
          <div className="space-y-1.5 p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200">2. Signal Extraction</span>
            <p>Go to <strong>Signal Decoder</strong>, upload your newly encoded image (or test with a preloaded sample). Watch the hidden SOS report reconstruct from pixel data.</p>
          </div>
          <div className="space-y-1.5 p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200">3. Coordinated Dispatch</span>
            <p>Switch role to <strong>Responder</strong> in the top navbar and inspect live cases in the <strong>Incident Dashboard</strong>, update status, and review culprit similarity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

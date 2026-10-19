'use client';

import React, { useState, useRef } from 'react';
import {
  Radio,
  Upload,
  CheckCircle2,
  FileSearch,
  ArrowRight,
  ShieldAlert,
  MapPin,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  decodeTextFromImageElement,
  parseDecodedMessage,
  SteganographyPayload,
} from '@/lib/steganography';
import { saveIncident } from '@/lib/incidentStore';
import Link from 'next/link';

export default function DecoderPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedRaw, setDecodedRaw] = useState<string | null>(null);
  const [parsedPayload, setParsedPayload] = useState<SteganographyPayload | null>(null);
  const [ingestedCaseId, setIngestedCaseId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setDecodedRaw(null);
        setParsedPayload(null);
        setIngestedCaseId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Perform decoding
  const handleDecode = () => {
    if (!imageSrc) {
      toast.error('Please select or upload an image first');
      return;
    }

    setIsDecoding(true);
    toast.loading('Analyzing pixel bitstream (LSB channel)...', { id: 'decode' });

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      try {
        const result = decodeTextFromImageElement(img);
        setIsDecoding(false);

        if (!result || result.trim().length === 0) {
          toast.error('No Sakhi steganographic signal found in this image.', {
            id: 'decode',
          });
          setDecodedRaw('No concealed payload detected.');
          setParsedPayload(null);
          return;
        }

        toast.success('Steganographic signal extracted successfully!', {
          id: 'decode',
        });
        setDecodedRaw(result);

        const parsed = parseDecodedMessage(result);
        setParsedPayload(parsed);
      } catch (err) {
        setIsDecoding(false);
        console.error(err);
        toast.error('Decoding failed on this image', { id: 'decode' });
      }
    };

    img.onerror = () => {
      setIsDecoding(false);
      toast.error('Failed to load image for decoding', { id: 'decode' });
    };
  };

  // Ingest parsed case into Dashboard
  const handleIngestToDashboard = () => {
    if (!parsedPayload) return;

    const newRecord = saveIncident({
      name: parsedPayload.name || 'Extracted Citizen',
      phone: parsedPayload.phone || 'Undisclosed',
      location: {
        lat: parsedPayload.location?.lat || 28.6139,
        lng: parsedPayload.location?.lng || 77.209,
        address: parsedPayload.location?.address || 'Decoded GPS Coordinates',
      },
      severity: parsedPayload.severity || 'High',
      status: 'Pending',
      situation: parsedPayload.situation || parsedPayload.rawText || 'Signal extracted via decoder',
      culpritDescription: parsedPayload.culprit || 'Traits extracted from steganography report',
      preferredContact: parsedPayload.preferredContact || ['Discreet'],
      decodedPayload: decodedRaw || '',
    });

    setIngestedCaseId(newRecord.id);
    toast.success(`Ingested into Incident Command Center as ${newRecord.id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-1">
        <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
          Authority Forensic Tool
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Steganography Signal Decoder
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Upload any suspected social media image. The forensic decoder extracts the concealed LSB telemetry and reconstructs the distress report.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Upload & Inspect Box */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Image Input & Analysis
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-400 rounded-md p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40"
          >
            <Upload size={24} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Click to upload suspected image
            </span>
            <span className="text-[11px] text-slate-400">
              Supports PNG, JPG (PNG preserves exact bitstream)
            </span>
          </div>

          {/* Image Preview */}
          {imageSrc && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Selected Image Preview:
              </span>
              <img
                src={imageSrc}
                alt="Selected to decode"
                className="w-full h-48 object-cover rounded border border-slate-200 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={handleDecode}
                disabled={isDecoding}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
              >
                <Radio size={14} /> Run Pixel Extraction
              </button>
            </div>
          )}
        </div>

        {/* Extraction Results */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm min-h-[300px]">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Decoded Forensic Telemetry</span>
            {parsedPayload && (
              <span className="text-xs font-mono text-emerald-600 font-semibold">
                ● Signal Valid
              </span>
            )}
          </h2>

          {!decodedRaw && (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <FileSearch size={32} className="text-slate-300 dark:text-slate-700" />
              <p className="text-xs">
                No image decoded yet. Upload an encoded image on the left and run pixel extraction.
              </p>
            </div>
          )}

          {decodedRaw && !parsedPayload && (
            <div className="p-4 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Raw Extracted String:
              </p>
              <p className="font-mono text-[11px] break-all">{decodedRaw}</p>
            </div>
          )}

          {parsedPayload && (
            <div className="space-y-4">
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <User size={13} /> {parsedPayload.name || 'Anonymous Citizen'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      parsedPayload.severity === 'Very High'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {parsedPayload.severity || 'Urgent'} Priority
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500 font-semibold text-[11px] uppercase">
                    Location Coordinates:
                  </p>
                  <p className="font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <MapPin size={12} /> {parsedPayload.location?.lat},{' '}
                    {parsedPayload.location?.lng} ({parsedPayload.location?.address || 'Direct Telemetry'})
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500 font-semibold text-[11px] uppercase">
                    Situation Report:
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {parsedPayload.situation || parsedPayload.rawText}
                  </p>
                </div>

                {parsedPayload.culprit && (
                  <div className="space-y-1">
                    <p className="text-slate-500 font-semibold text-[11px] uppercase">
                      Perpetrator Traits:
                    </p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {parsedPayload.culprit}
                    </p>
                  </div>
                )}
              </div>

              {/* Ingest Action */}
              {!ingestedCaseId ? (
                <button
                  type="button"
                  onClick={handleIngestToDashboard}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <ShieldAlert size={14} /> Ingest as Active Incident in Dashboard
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Case registered: {ingestedCaseId}
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 text-slate-800 dark:text-slate-200"
                  >
                    Open Incident Dashboard <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

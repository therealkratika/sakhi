'use client';

import React, { useState, useRef } from 'react';
import {
  MapPin,
  Camera,
  CheckCircle2,
  Download,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  encodeTextToImageData,
  decodeTextFromImageElement,
  buildPayloadString,
  SteganographyPayload,
} from '@/lib/steganography';
import { saveIncident } from '@/lib/incidentStore';
import Link from 'next/link';

// Curated high quality innocent cover photo presets (data/public safe images)
const COVER_PRESETS = [
  {
    id: 'flowers',
    name: 'Morning Blossoms',
    caption: 'Gentle morning flowers in the balcony garden. Wishing everyone peace and clarity today. 🌸',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'coffee',
    name: 'Warm Coffee & Book',
    caption: 'Taking a quiet moment with warm coffee before the day starts. Hope everyone is doing well. ☕',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nature',
    name: 'Quiet Woodland Path',
    caption: 'A calm walk along the forest path. Nature always brings a fresh breath of perspective. 🍃',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sunset',
    name: 'Golden Evening Sky',
    caption: 'Beautiful evening colors over the horizon today. Resting and recharging for tomorrow. 🌅',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
];

export default function CreatePostPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 Form Data
  const [name, setName] = useState('Ananya S.');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [locationName, setLocationName] = useState('Vasant Kunj, New Delhi');
  const [lat, setLat] = useState(28.5355);
  const [lng, setLng] = useState(77.1558);
  const [severity, setSeverity] = useState<'Very High' | 'High' | 'Medium' | 'Low'>('High');
  const [situation, setSituation] = useState(
    'Abuser is confiscating communications and threatening severe violence if I attempt to contact relatives. I need legal intervention and safe shelter extraction without raising alarm.'
  );
  const [culprit, setCulprit] = useState(
    'Spouse, approx 36 yrs, stocky build, driving black SUV. Has history of verbal rage and physical intimidation.'
  );
  const [contactMethods] = useState<string[]>([
    'Text message',
    'Discreet Signal',
  ]);

  // Step 2 Cover & Steganography Data
  const [selectedPreset, setSelectedPreset] = useState(COVER_PRESETS[0]);
  const [disguiseCaption, setDisguiseCaption] = useState(COVER_PRESETS[0].caption);
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [encodedDataUrl, setEncodedDataUrl] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [testDecodedResult, setTestDecodedResult] = useState<string | null>(null);
  const [dispatchedCaseId, setDispatchedCaseId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle preset change
  const handleSelectPreset = (preset: typeof COVER_PRESETS[0]) => {
    setSelectedPreset(preset);
    setDisguiseCaption(preset.caption);
    setCustomImageSrc(null);
    setEncodedDataUrl(null);
  };

  // Handle custom upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImageSrc(event.target?.result as string);
        setEncodedDataUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Detect Geolocation
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Acquiring precise GPS coordinates...', { id: 'geo' });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setLocationName(`Coordinates: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          toast.success('Coordinates secured', { id: 'geo' });
        },
        () => {
          toast.error('Location permission denied. Using manual coordinates.', { id: 'geo' });
        }
      );
    }
  };

  // Perform Steganography Encoding
  const handleRunSteganography = async () => {
    setIsEncoding(true);
    toast.loading('Embedding distress telemetry into canvas pixels...', { id: 'stego' });

    try {
      const payload: SteganographyPayload = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        name: isAnonymous ? 'Anonymous Victim' : name,
        phone,
        location: { lat, lng, address: locationName },
        severity,
        situation,
        culprit,
        preferredContact: contactMethods,
      };

      const payloadString = buildPayloadString(payload);

      // Load image into HTMLImageElement
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = customImageSrc || selectedPreset.url;

      img.onload = () => {
        try {
          const resultDataUrl = encodeTextToImageData(img, payloadString);
          setEncodedDataUrl(resultDataUrl);

          // Automatically ingest into local incident store for prototype
          const newIncident = saveIncident({
            name: isAnonymous ? 'Anonymous Victim' : name,
            phone,
            location: { lat, lng, address: locationName },
            severity,
            status: 'Pending',
            situation,
            culpritDescription: culprit,
            preferredContact: contactMethods,
            encodedImageUrl: resultDataUrl,
            decodedPayload: payloadString,
          });

          setDispatchedCaseId(newIncident.id);
          setIsEncoding(false);
          toast.success('Steganography complete & dispatched to triage board', { id: 'stego' });
          setStep(3);
        } catch (err) {
          console.error(err);
          setIsEncoding(false);
          toast.error('Encoding error on this image format', { id: 'stego' });
        }
      };

      img.onerror = () => {
        setIsEncoding(false);
        toast.error('Failed to load cover image. Please try another preset or upload a custom image.', { id: 'stego' });
      };
    } catch {
      setIsEncoding(false);
      toast.error('Steganography failed', { id: 'stego' });
    }
  };

  // Test-decode the generated image
  const handleTestDecode = () => {
    if (!encodedDataUrl) return;
    const img = new Image();
    img.src = encodedDataUrl;
    img.onload = () => {
      const decoded = decodeTextFromImageElement(img);
      setTestDecodedResult(decoded);
      toast.success('Hidden telemetry decoded successfully!');
    };
  };

  // Download Encoded PNG
  const handleDownload = () => {
    if (!encodedDataUrl) return;
    const link = document.createElement('a');
    link.download = `sakhi_photo_${Date.now()}.png`;
    link.href = encodedDataUrl;
    link.click();
    toast.success('Encoded image saved as PNG');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Step Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Steganographic Distress Protocol
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Discreet SOS Studio
            </h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Step {step} of 3
          </span>
        </div>

        {/* Progress Tabs */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => setStep(1)}
            className={`py-2 text-xs font-semibold text-left px-3 rounded border transition-colors ${
              step === 1
                ? 'border-slate-900 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600'
            }`}
          >
            1. Incident Telemetry
          </button>
          <button
            onClick={() => step > 1 && setStep(2)}
            disabled={step < 2}
            className={`py-2 text-xs font-semibold text-left px-3 rounded border transition-colors ${
              step === 2
                ? 'border-slate-900 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 disabled:opacity-50'
            }`}
          >
            2. Cover & Pixel Encode
          </button>
          <button
            onClick={() => step === 3 && setStep(3)}
            disabled={step < 3}
            className={`py-2 text-xs font-semibold text-left px-3 rounded border transition-colors ${
              step === 3
                ? 'border-slate-900 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 disabled:opacity-50'
            }`}
          >
            3. Dispatch & Export
          </button>
        </div>
      </div>

      {/* STEP 1: INCIDENT TELEMETRY FORM */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Emergency Incident Information
            </h2>
            <p className="text-xs text-slate-500">
              Provide necessary details for first responders. This data will be concealed within the image bitstream.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name / Anonymous */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Victim / Reporter Name
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Mask as Anonymous
                </label>
              </div>
              <input
                type="text"
                disabled={isAnonymous}
                value={isAnonymous ? 'Confidential Citizen' : name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name or alias"
                className="w-full text-xs px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Safe Contact Phone/Handle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Safe Phone or Contact Channel
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ... or safe handle"
                className="w-full text-xs px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Location / Distress Coordinates
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="inline-flex items-center gap-1 text-xs text-slate-800 dark:text-slate-200 font-semibold hover:underline"
                >
                  <MapPin size={12} /> Auto-Detect Coordinates
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Area / Landmark description"
                  className="sm:col-span-2 text-xs px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <div className="flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-2.5 bg-slate-50 dark:bg-slate-800">
                  GPS: {lat}, {lng}
                </div>
              </div>
            </div>

            {/* Severity Level */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Urgency & Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Very High'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 px-3 text-xs font-semibold rounded border transition-colors text-center ${
                      severity === lvl
                        ? lvl === 'Very High'
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-slate-900 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Situation */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Detailed Situation & Imminent Risk
              </label>
              <textarea
                rows={3}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Describe current safety conditions, threats, or confinement..."
                className="w-full text-xs px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Culprit Profile */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Perpetrator Physical Traits & Behavior (For Officer Matching)
              </label>
              <input
                type="text"
                value={culprit}
                onChange={(e) => setCulprit(e.target.value)}
                placeholder="Age, vehicle, relation, physical description, weapons if any"
                className="w-full text-xs px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
            >
              Next: Select Cover & Encode <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COVER PHOTO & PIXEL STEGANOGRAPHY */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Select Innocuous Cover Photo & Disguise Caption
            </h2>
            <p className="text-xs text-slate-500">
              The image will look 100% normal on social media. The secret telemetry will be injected into the least significant bit (LSB) of each pixel.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Choose Pre-Approved Innocent Photo or Upload Custom
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COVER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`cursor-pointer rounded border p-1.5 transition-all ${
                    selectedPreset.id === preset.id && !customImageSrc
                      ? 'border-slate-900 ring-2 ring-slate-900/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {preset.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Upload Custom option */}
            <div className="pt-2 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Camera size={14} /> Upload Custom Photo
              </button>
              {customImageSrc && (
                <span className="text-xs text-emerald-600 font-semibold">
                  Custom image loaded
                </span>
              )}
            </div>
          </div>

          {/* Disguise Social Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Innocent Social Media Caption
            </label>
            <input
              type="text"
              value={disguiseCaption}
              onChange={(e) => setDisguiseCaption(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* Steganography Specification Badge */}
          <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400 font-mono">
            <div className="font-semibold text-slate-800 dark:text-slate-200 font-sans flex items-center gap-1.5">
              <Lock size={13} /> LSB Steganography Engine Parameters
            </div>
            <p>• Protocol: 16-bit terminated binary bitstream (End marker: 1111111111111110)</p>
            <p>• Channel Target: Red pixel LSB • Visibility: Imperceptible to human eye</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="button"
              onClick={handleRunSteganography}
              disabled={isEncoding}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles size={14} /> Encode & Dispatch SOS
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DISPATCH & EXPORT */}
      {step === 3 && encodedDataUrl && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={20} />
            <h2 className="text-base font-bold">
              Discreet SOS Generated & Dispatched Successfully!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Encoded Image Preview */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Steganographically Encoded Cover Image
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded p-1 bg-slate-50 dark:bg-slate-800">
                <img
                  src={encodedDataUrl}
                  alt="Encoded Cover"
                  className="w-full h-64 object-cover rounded"
                />
              </div>
              <p className="text-[11px] text-slate-500 italic">
                &ldquo;{disguiseCaption}&rdquo;
              </p>
            </div>

            {/* Incident Details & Actions */}
            <div className="space-y-4">
              <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Incident Case ID
                  </span>
                  <span className="font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold">
                    {dispatchedCaseId || 'HVN-8821'}
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 space-y-1">
                  <p>• Location: <strong>{locationName}</strong></p>
                  <p>• Urgency: <strong className="text-rose-600">{severity}</strong></p>
                  <p>• Status: <strong className="text-amber-600">Dispatched to Responder Board</strong></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <Download size={14} /> Download Encoded PNG
                </button>

                <button
                  type="button"
                  onClick={handleTestDecode}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Lock size={14} /> Test-Decode Hidden Payload
                </button>

                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  View in Incident Dashboard <ArrowRight size={14} />
                </Link>
              </div>

              {/* Decoded Test Output */}
              {testDecodedResult && (
                <div className="p-3 rounded bg-slate-900 text-slate-100 text-[11px] font-mono break-all space-y-1">
                  <span className="text-emerald-400 font-semibold font-sans block">
                    ✓ Verified Decoded Bitstream:
                  </span>
                  <p>{testDecodedResult}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

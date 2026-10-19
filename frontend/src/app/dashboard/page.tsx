'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Phone,
} from 'lucide-react';
import {
  IncidentRecord,
  getStoredIncidents,
  updateIncidentStatus,
} from '@/lib/incidentStore';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);

  const loadData = useCallback(() => {
    const data = getStoredIncidents();
    setIncidents(data);
    if (data.length > 0 && !selectedIncident) {
      setSelectedIncident(data[0]);
    }
  }, [selectedIncident]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = (id: string, newStatus: IncidentRecord['status']) => {
    const updated = updateIncidentStatus(id, newStatus);
    setIncidents(updated);
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.success(`Case ${id} marked as ${newStatus}`);
  };

  const filteredIncidents = incidents.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.situation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSeverity =
      severityFilter === 'All' || item.severity === severityFilter;

    const matchStatus =
      statusFilter === 'All' || item.status === statusFilter;

    return matchSearch && matchSeverity && matchStatus;
  });

  // Calculate Metrics
  const totalCases = incidents.length;
  const criticalCases = incidents.filter(
    (i) => i.severity === 'Very High' || i.severity === 'High'
  ).length;
  const pendingCases = incidents.filter((i) => i.status === 'Pending').length;
  const dispatchedCases = incidents.filter((i) => i.status === 'Dispatched').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Live Monitoring Queue
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Authority Incident Command Center
          </h1>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
        >
          <RefreshCw size={13} /> Refresh Stream
        </button>
      </div>

      {/* Metrics Bar (Flat, zero gradients) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Triaged</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {totalCases}
          </p>
        </div>
        <div className="p-4 rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm">
          <span className="text-xs text-rose-700 dark:text-rose-400 font-semibold">
            Critical / High Urgency
          </span>
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-0.5">
            {criticalCases}
          </p>
        </div>
        <div className="p-4 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
            Pending Review
          </span>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">
            {pendingCases}
          </p>
        </div>
        <div className="p-4 rounded-md border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm">
          <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
            Units Dispatched
          </span>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-0.5">
            {dispatchedCases}
          </p>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by victim name, Case ID, location, or keywords..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded p-1 bg-white dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-400 px-1">Urgency:</span>
          {['All', 'Very High', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded p-1 bg-white dark:bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-400 px-1">Status:</span>
          {['All', 'Pending', 'In Review', 'Dispatched', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Table & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table / List (2 columns on lg) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Active Incidents ({filteredIncidents.length})
            </span>
            <span className="text-[11px] text-slate-400">Click a record to inspect</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No incidents matching active filters.
              </div>
            ) : (
              filteredIncidents.map((item) => {
                const isSelected = selectedIncident?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIncident(item)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-l-4 border-slate-900 dark:border-slate-100'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.id}
                        </span>
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400">• {item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <MapPin size={12} className="shrink-0" />
                        {item.location.address}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        {item.situation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Urgency Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.severity === 'Very High'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.severity === 'High'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.severity}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'In Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Inspector Drawer */}
        <div className="bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5 sticky top-20">
          {selectedIncident ? (
            <>
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Incident Inspector
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedIncident.id}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    selectedIncident.severity === 'Very High'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {selectedIncident.severity} Urgency
                </span>
              </div>

              {/* Victim & Contact */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  Victim / Reporter
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedIncident.name}
                </p>
                {selectedIncident.phone && (
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Phone size={12} /> {selectedIncident.phone}
                  </p>
                )}
                <p className="text-slate-500">
                  Safe channel:{' '}
                  {selectedIncident.preferredContact?.join(', ') || 'Discreet Signal'}
                </p>
              </div>

              {/* Location telemetry */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  Coordinates & Area
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <MapPin size={12} /> {selectedIncident.location.address}
                </p>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  GPS: {selectedIncident.location.lat}, {selectedIncident.location.lng}
                </div>
              </div>

              {/* Incident Narrative */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  Reported Situation
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  {selectedIncident.situation}
                </p>
              </div>

              {/* Perpetrator Matching */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">
                  Perpetrator Profile
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedIncident.culpritDescription}
                </p>
                {selectedIncident.matchedPerpetratorProfile && (
                  <div className="p-2.5 rounded border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle size={12} /> High Profile Match:{' '}
                      {selectedIncident.matchedPerpetratorProfile.matchRate}% Cosine Similarity
                    </span>
                    <p className="text-[11px]">
                      Matches: {selectedIncident.matchedPerpetratorProfile.alias} (
                      {selectedIncident.matchedPerpetratorProfile.previousIncidents} prior reported
                      incidents)
                    </p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Update Case Status
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'In Review')}
                    className="py-1.5 px-2 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 text-slate-800 dark:text-slate-200"
                  >
                    Mark In Review
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'Dispatched')}
                    className="py-1.5 px-2 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
                  >
                    Dispatch Unit
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'Resolved')}
                    className="col-span-2 py-1.5 px-2 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                  >
                    Resolve / Close Case
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-400 text-center py-10">
              Select an incident to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

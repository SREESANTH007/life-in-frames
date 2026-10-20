import React, { useState, useEffect } from 'react'
import {
  HardDrive,
  Shield,
  Download,
  Upload,
  Moon,
  Info,
  CheckCircle2,
  Database,
  Trash2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { SyncStatusBadge } from '../components/ui/SyncStatusBadge'
import { indexedDbRepository } from '../services/indexedDbRepository'
import { syncQueueService } from '../services/db/syncQueue'
import { useEntries } from '../context/useEntries'

export const SettingsPage: React.FC = () => {
  const { entries } = useEntries()
  const [storageInfo, setStorageInfo] = useState<{ formattedUsage: string }>({
    formattedUsage: '< 1 MB',
  })
  const [pendingSyncCount, setPendingSyncCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  useEffect(() => {
    indexedDbRepository.getStorageEstimate().then((info) => {
      setStorageInfo({ formattedUsage: info.formattedUsage })
    })
    syncQueueService.getPendingCount().then((count) => {
      setPendingSyncCount(count)
    })
  }, [entries])

  // Export JSON backup (PRD Section 18.1)
  const handleExportArchive = async () => {
    try {
      setIsExporting(true)
      const json = await indexedDbRepository.exportArchive()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().split('T')[0]
      a.href = url
      a.download = `life_in_frames_archive_${today}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  // Import JSON backup (PRD Section 18.1)
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      setImportMessage(null)
      const text = await file.text()
      const res = await indexedDbRepository.importArchive(text)
      setImportMessage(`Successfully imported ${res.imported} frames (${res.failed} skipped). Refreshing...`)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed'
      setImportMessage(`Error: ${msg}`)
    } finally {
      setIsImporting(false)
    }
  }

  // Clear archive
  const handleClearDatabase = async () => {
    if (
      window.confirm(
        'Are you sure you want to completely erase your local database? All local frames will be permanently deleted.'
      )
    ) {
      await indexedDbRepository.clearAll()
      await syncQueueService.clear()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f3f4f6] font-display">
          Settings & Archive Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#9da3b4] mt-0.5">
          Configure local IndexedDB storage, data portability, privacy, and display preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offline & Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <CardTitle>Offline & IndexedDB</CardTitle>
            </div>
            <SyncStatusBadge status="offline_only" />
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-[#9da3b4]">
              Life in Frames is built offline-first. Your entire record library lives locally in your device's IndexedDB storage.
            </p>

            <div className="p-3 rounded-xl bg-[#171a24] border border-white/[0.06] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Storage Engine</span>
                <span className="font-medium text-[#f3f4f6] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  IndexedDB (Schema v1)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Total Frames Stored</span>
                <span className="font-medium text-[#f3f4f6]">{entries.length} Records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Offline Sync Queue</span>
                <span className="font-medium text-purple-300">
                  {pendingSyncCount} Changes Queued
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Estimated Space Used</span>
                <span className="font-medium text-[#f3f4f6]">{storageInfo.formattedUsage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Offline Status</span>
                <span className="font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Offline Ready
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearDatabase}
                leftIcon={<Trash2 className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Clear Local Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Portability (PRD Section 18.1) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              <CardTitle>Data Portability & Backup</CardTitle>
            </div>
            <Badge variant="purple" size="sm">JSON v1.0</Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-[#9da3b4]">
              Your archive belongs strictly to you. Export a full, machine-readable JSON backup of your records, or restore an existing backup file.
            </p>

            {importMessage && (
              <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                {importMessage}
              </div>
            )}

            <div className="space-y-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportArchive}
                isLoading={isExporting}
                leftIcon={<Download className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Export JSON Archive
              </Button>

              <label className="block">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  disabled={isImporting}
                  className="hidden"
                  id="import-archive-input"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-archive-input')?.click()}
                  isLoading={isImporting}
                  leftIcon={<Upload className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  Import JSON Archive
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Theme & Display */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <CardTitle>Display & Theme</CardTitle>
            </div>
            <Badge variant="purple" size="sm">Cinematic Dark</Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-[#9da3b4]">
              Cinematic deep charcoal theme with muted purple accents, optimized for readability and OLED battery efficiency.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl border border-purple-500/50 bg-[#171a24] text-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mx-auto mb-1" />
                <span className="text-[11px] font-medium text-[#f3f4f6]">Deep Dark</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/[0.08] bg-[#11131a] opacity-50 text-center">
                <div className="w-4 h-4 rounded-full bg-[#1e2230] mx-auto mb-1" />
                <span className="text-[11px] font-medium text-[#9da3b4]">Midnight</span>
              </div>
              <div className="p-2.5 rounded-xl border border-white/[0.08] bg-[#11131a] opacity-50 text-center">
                <div className="w-4 h-4 rounded-full bg-[#2a2438] mx-auto mb-1" />
                <span className="text-[11px] font-medium text-[#9da3b4]">OLED Pure</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Principles */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <CardTitle>Privacy & Sovereignty</CardTitle>
            </div>
            <Badge variant="success" size="sm">Private</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-[#9da3b4]">
            <p className="leading-relaxed">
              In accordance with PRD Section 17:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-[#9da3b4]">
              <li>Zero analytics SDKs or telemetry trackers</li>
              <li>Zero AI summarization or model scraping</li>
              <li>No public feeds, social profiles, or followers</li>
              <li>Complete data confidentiality and encryption ready</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* About Box */}
      <Card variant="elevated">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-[#f3f4f6]">Life in Frames v0.3.0</div>
              <div className="text-[#9da3b4]">Phase 3: Local IndexedDB Persistence & Offline Storage Layer</div>
            </div>
          </div>
          <Badge variant="purple" size="sm">Schema v1 Active</Badge>
        </CardContent>
      </Card>
    </div>
  )
}

import React from 'react'
import {
  HardDrive,
  Shield,
  Download,
  Moon,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { SyncStatusBadge } from '../components/ui/SyncStatusBadge'

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f3f4f6] font-display">
          Settings & Archive Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#9da3b4] mt-0.5">
          Configure local storage, display preferences, privacy, and archive exports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Offline & Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <CardTitle>Offline & Storage</CardTitle>
            </div>
            <SyncStatusBadge status="offline_only" />
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-[#9da3b4]">
              Life in Frames is built offline-first. Your entire record library lives locally in your browser storage.
            </p>

            <div className="p-3 rounded-xl bg-[#171a24] border border-white/[0.06] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Local Storage Engine</span>
                <span className="font-medium text-[#f3f4f6]">IndexedDB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Estimated Space Used</span>
                <span className="font-medium text-[#f3f4f6]">&lt; 1 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9da3b4]">Offline Status</span>
                <span className="font-medium text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Offline Ready
                </span>
              </div>
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
              Cinematic deep charcoal theme with muted purple accents, optimized for readability and battery efficiency.
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
              <li>Complete data confidentiality and encryption</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Export & Backup */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              <CardTitle>Data Portability</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-[#9da3b4]">
              Your archive belongs strictly to you. Export a full, machine-readable JSON archive of all entries and relationships.
            </p>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Export JSON Archive
            </Button>
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
              <div className="font-semibold text-[#f3f4f6]">Life in Frames v0.1.0</div>
              <div className="text-[#9da3b4]">Responsive React + Vite + TypeScript web application for Android</div>
            </div>
          </div>
          <Badge variant="outline" size="sm">Phase 1 Foundation</Badge>
        </CardContent>
      </Card>
    </div>
  )
}

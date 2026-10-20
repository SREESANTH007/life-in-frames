import React from 'react'
import { Wifi, WifiOff, Cloud, RefreshCw } from 'lucide-react'
import type { SyncState } from '../../types'

export interface SyncStatusBadgeProps {
  status?: SyncState
  isOnline?: boolean
  className?: string
  showText?: boolean
}

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  status = 'offline_only',
  isOnline = navigator.onLine,
  className = '',
  showText = true,
}) => {
  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        label: 'Offline Ready',
        description: 'Changes saved locally in IndexedDB',
        icon: <WifiOff className="w-3.5 h-3.5 text-amber-400" />,
        badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      }
    }

    switch (status) {
      case 'synced':
        return {
          label: 'Synchronized',
          description: 'Local archive is up to date',
          icon: <Cloud className="w-3.5 h-3.5 text-emerald-400" />,
          badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        }
      case 'pending_sync':
        return {
          label: 'Pending Sync',
          description: 'Queued for cloud synchronization',
          icon: <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />,
          badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        }
      case 'sync_error':
        return {
          label: 'Sync Alert',
          description: 'Conflict or network issue',
          icon: <Wifi className="w-3.5 h-3.5 text-rose-400" />,
          badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
        }
      case 'offline_only':
      default:
        return {
          label: 'Local Archive',
          description: 'Operating in private offline storage',
          icon: <Wifi className="w-3.5 h-3.5 text-purple-400" />,
          badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div
      title={config.description}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeClass} ${className}`}
    >
      {config.icon}
      {showText && <span>{config.label}</span>}
    </div>
  )
}

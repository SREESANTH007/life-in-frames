import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { BaseEntry } from '../../types'

export interface DeleteConfirmDialogProps {
  entry: BaseEntry | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isDeleting?: boolean
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  entry,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!entry) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-[#f3f4f6] font-display">
            Delete Archive Frame?
          </h3>
          <p className="text-xs text-[#9da3b4] mt-1.5 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <strong className="text-[#f3f4f6]">"{entry.title}"</strong>? This will remove the record from your local timeline.
          </p>
        </div>

        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2.5">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  )
}

'use client'

import { exportToCSV, exportToPDF } from '@/lib/exportUtils'
import type { Profile, TermWithSubjects } from '@/types/database'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ExportMenuProps {
  terms: TermWithSubjects[]
  profile: Profile
  cumulativeGwa: number | null
}

export default function ExportMenu({ terms, profile, cumulativeGwa }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<'csv' | 'pdf' | null>(null)

  async function handleExport(type: 'csv' | 'pdf') {
    setLoading(type)
    setOpen(false)
    try {
      if (type === 'csv') {
        await exportToCSV(terms, profile)
      } else {
        await exportToPDF(terms, profile, cumulativeGwa)
      }
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative">
      <button
        id="export-menu-button"
        onClick={() => setOpen((o) => !o)}
        disabled={loading !== null || terms.length === 0}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Export
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Dropdown */}
          <div
            className="absolute right-0 top-full z-20 mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-border bg-background shadow-lg ring-1 ring-foreground/5"
            role="menu"
          >
            <button
              id="export-csv-button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              onClick={() => handleExport('csv')}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              Export as CSV
            </button>
            <button
              id="export-pdf-button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4 text-[#800000]" />
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}

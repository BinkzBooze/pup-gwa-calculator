/**
 * Client-side export utilities for PDF and CSV download.
 * These functions are called from Client Components only (not Server Components).
 */

import type { Profile, TermWithSubjects } from '@/types/database'
import { calculateTermGwa } from '@/lib/calculateGwa'

/** Strip characters that are unsafe in filenames and collapse whitespace. */
function sanitizeFilename(name: string | null): string {
  if (!name) return 'grades'
  return name
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars (keep letters, digits, _, -, space)
    .replace(/\s+/g, '_')        // replace runs of spaces with underscores
    .replace(/_{2,}/g, '_')      // collapse consecutive underscores
    .slice(0, 60)                // cap length
    || 'grades'
}

function triggerDownloadViaAPI(base64data: string, contentType: string, filename: string) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = `/api/export/${encodeURIComponent(filename)}`
  form.style.display = 'none'

  const nameInput = document.createElement('input')
  nameInput.type = 'hidden'
  nameInput.name = 'filename'
  nameInput.value = filename

  const typeInput = document.createElement('input')
  typeInput.type = 'hidden'
  typeInput.name = 'contentType'
  typeInput.value = contentType

  const dataInput = document.createElement('input')
  dataInput.type = 'hidden'
  dataInput.name = 'base64data'
  dataInput.value = base64data

  form.appendChild(nameInput)
  form.appendChild(typeInput)
  form.appendChild(dataInput)
  document.body.appendChild(form)

  // Submitting the form navigates the page to the API route, which returns a file attachment.
  // Native HTML forms bypass React/Next.js interceptors, ensuring a raw browser HTTP request.
  form.submit()

  // Delay cleanup
  setTimeout(() => {
    if (document.body.contains(form)) {
      document.body.removeChild(form)
    }
  }, 1000)
}

async function getLogoDataUrl(): Promise<string> {
  try {
    const res = await fetch('/icon.png')
    if (!res.ok) return ''
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve('')
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error('Failed to load logo:', err)
    return ''
  }
}

// ─── CSV Export (PapaParse) ─────────────────────────────────────────────────

export async function exportToCSV(
  terms: TermWithSubjects[],
  profile: Profile
): Promise<void> {
  // Dynamic import so jsPDF/papaparse are not bundled server-side
  const Papa = (await import('papaparse')).default

  // Flatten the nested terms → subjects structure into a flat row array
  const rows = terms.flatMap((term) =>
    term.subjects.map((subject) => [
      term.title,
      subject.code,
      subject.units,
      subject.grade,
    ])
  )

  const csv = Papa.unparse({
    fields: ['Semester', 'Course Code', 'Units', 'Grade'],
    data: rows,
  })

  // Convert string to base64 properly handling unicode characters
  const base64data = btoa(unescape(encodeURIComponent(csv)))
  const filename = `${sanitizeFilename(profile.display_name)}_GWA_Record.csv`

  triggerDownloadViaAPI(base64data, 'text/csv;charset=utf-8;', filename)
}

// ─── PDF Export (jsPDF + autotable) ──────────────────────────────────────────

export async function exportToPDF(
  terms: TermWithSubjects[],
  profile: Profile,
  cumulativeGwa: number | null
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const MAROON = [128, 0, 0] as [number, number, number]
  const GOLD = [255, 215, 0] as [number, number, number]
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14

  const logoBase64 = await getLogoDataUrl()

  // ── Header bar ──
  doc.setFillColor(...MAROON)
  doc.rect(0, 0, pageWidth, 28, 'F')

  const headerMarginX = 8
  let textStartX = headerMarginX

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', headerMarginX, 5, 14, 14)
    textStartX = headerMarginX + 17
  }

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('BINKZ', textStartX, 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...GOLD)
  doc.text('Polytechnic University of the Philippines GWA Calculator', textStartX, 14.5)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.text(`Academic Record: ${profile.display_name ?? 'Student'}`, textStartX, 21)

  // ── Cumulative GWA box ──
  let currentY = 36
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 18, 3, 3, 'F')
  doc.setTextColor(...MAROON)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Cumulative GWA', margin + 4, currentY + 7)
  doc.setFontSize(16)
  doc.text(
    cumulativeGwa !== null ? cumulativeGwa.toFixed(4) : 'N/A',
    margin + 4,
    currentY + 15
  )

  doc.setTextColor(80, 80, 80)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })}`,
    pageWidth - margin - 2,
    currentY + 7,
    { align: 'right' }
  )

  currentY += 24

  // ── Per-term tables ──
  for (const term of terms) {
    // Term title heading
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...MAROON)

    // Check page overflow
    if (currentY > 265) {
      doc.addPage()
      currentY = 14
    }

    doc.text(term.title, margin, currentY + 5)
    currentY += 8

    const tableRows: any[] = term.subjects.map((s) => [s.code, s.units.toString(), s.grade])

    const { gwa, totalUnits } = calculateTermGwa(term.subjects)
    tableRows.push([
      { content: 'Total Units / GWA', styles: { fontStyle: 'bold', halign: 'right' } },
      { content: totalUnits.toString(), styles: { fontStyle: 'bold' } },
      { content: gwa !== null ? gwa.toFixed(4) : 'N/A', styles: { fontStyle: 'bold' } }
    ])

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Course Code', 'Units', 'Grade']],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: MAROON,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
      },
      didParseCell: (data) => {
        // Colour failing grades red
        if (data.column.index === 2 && data.cell.raw === '5.0') {
          data.cell.styles.textColor = [200, 0, 0]
          data.cell.styles.fontStyle = 'bold'
        }
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentY = (doc as any).lastAutoTable.finalY + 6
  }

  // ── Footer ──
  const pageCount = (doc.internal as { getNumberOfPages: () => number }).getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${pageCount} — Binkz`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    )
  }

  const dataUri = doc.output('datauristring')
  const base64data = dataUri.split(',')[1] // Extract just the base64 payload
  const filename = `${sanitizeFilename(profile.display_name)}_GWA_Record.pdf`

  triggerDownloadViaAPI(base64data, 'application/pdf', filename)
}

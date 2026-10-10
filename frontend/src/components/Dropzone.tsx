import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface DropzoneProps {
  label: string
  file: File | null
  onFile: (f: File) => void
  onRemove: () => void
  accept?: Record<string, string[]>
  disabled?: boolean
}

export default function Dropzone({ label, file, onFile, onRemove, accept, disabled }: DropzoneProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ?? {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled,
  })

  if (file) {
    return (
      <div style={s.fileCard}>
        <div style={s.fileLeft}>
          <div style={s.fileIconWrap}>📄</div>
          <div>
            <div style={s.fileName}>{file.name}</div>
            <div style={s.fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
          </div>
        </div>
        <button onClick={onRemove} style={s.removeBtn} title="Remove">✕</button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      style={{
        ...s.zone,
        borderColor: isDragActive ? 'var(--accent)' : 'var(--border)',
        background: isDragActive ? 'rgba(99,102,241,0.06)' : 'var(--bg-elevated)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <div style={s.zoneIcon}>{isDragActive ? '📂' : '⬆️'}</div>
      <p style={s.zoneTitle}>{isDragActive ? 'Drop it here!' : label}</p>
      <p style={s.zoneHint}>PDF, DOC, DOCX · max 5MB</p>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  zone: {
    border: '2px dashed', borderRadius: 14,
    padding: '32px 20px', textAlign: 'center',
    transition: 'all 0.2s', userSelect: 'none',
  },
  zoneIcon: { fontSize: 28, marginBottom: 10 },
  zoneTitle: { fontSize: 14, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 4 },
  zoneHint: { fontSize: 12, color: 'var(--text-muted)' },
  fileCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border-active)',
    borderRadius: 12, padding: '14px 16px', gap: 12,
  },
  fileLeft: { display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' },
  fileIconWrap: { fontSize: 22, flexShrink: 0 },
  fileName: {
    fontSize: 14, fontWeight: 600, color: 'var(--text)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200,
  },
  fileSize: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  removeBtn: {
    background: 'rgba(244,63,94,0.1)', border: 'none', color: 'var(--red)',
    width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
    fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontFamily: 'var(--font-body)',
  },
}
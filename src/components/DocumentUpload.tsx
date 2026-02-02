'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Document {
  id: string
  name: string
  type: string
  status: 'uploading' | 'analyzing' | 'complete' | 'error'
  data?: Record<string, unknown>
}

const documentTypes = [
  { id: 'w2', label: 'W-2', desc: 'Wage and Tax Statement' },
  { id: '1099', label: '1099', desc: 'Freelance/Contract Income' },
  { id: '1099-int', label: '1099-INT', desc: 'Interest Income' },
  { id: '1099-div', label: '1099-DIV', desc: 'Dividend Income' },
  { id: 'receipt', label: 'Receipt', desc: 'Deductible Expense' },
  { id: 'other', label: 'Other', desc: 'Other Tax Document' },
]

export function DocumentUpload() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const doc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        type: 'analyzing',
        status: 'uploading',
      }
      
      setDocuments(prev => [...prev, doc])

      // Simulate upload and analysis
      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'analyzing' } : d
        ))
      }, 500)

      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? { 
                ...d, 
                status: 'complete',
                type: file.name.toLowerCase().includes('w2') ? 'W-2' 
                  : file.name.toLowerCase().includes('1099') ? '1099'
                  : 'Document',
                data: {
                  documentType: 'Tax Document',
                  taxYear: '2024',
                  extractedFields: {
                    'Gross Income': '$75,000',
                    'Federal Withholding': '$12,500',
                    'State Withholding': '$3,750',
                  }
                }
              } 
            : d
        ))
      }, 2000)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
    if (selectedDoc?.id === id) setSelectedDoc(null)
  }

  const statusConfig = {
    uploading: { color: 'blue', icon: Upload, text: 'Uploading...' },
    analyzing: { color: 'amber', icon: Eye, text: 'Analyzing...' },
    complete: { color: 'emerald', icon: CheckCircle2, text: 'Complete' },
    error: { color: 'red', icon: AlertCircle, text: 'Error' },
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Upload className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Document Upload</h2>
          <p className="text-sm text-slate-400">Upload tax documents for AI analysis</p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card 
        variant="glass" 
        className={`border-2 border-dashed transition-all cursor-pointer ${
          isDragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-slate-600'
        }`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="text-center py-8">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-emerald-400' : 'text-slate-500'}`} />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop tax documents'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            or click to browse (PDF, PNG, JPG up to 10MB)
          </p>
          <Button variant="outline" size="sm">Browse Files</Button>
        </div>
      </Card>

      {/* Document Types */}
      <div>
        <h3 className="font-semibold mb-3">Supported Document Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {documentTypes.map((type) => (
            <Card key={type.id} variant="glass" className="text-center py-3 px-2">
              <FileText className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              <p className="font-medium text-sm">{type.label}</p>
              <p className="text-xs text-slate-500">{type.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Uploaded Documents ({documents.length})</h3>
          <div className="space-y-3">
            {documents.map((doc) => {
              const status = statusConfig[doc.status]
              const StatusIcon = status.icon

              return (
                <Card key={doc.id} variant="glass" className="hover:border-slate-600 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-slate-400">{doc.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-${status.color}-500/10 text-${status.color}-400`}>
                        <StatusIcon className={`w-4 h-4 ${doc.status === 'analyzing' ? 'animate-pulse' : ''}`} />
                        <span className="text-xs font-medium">{status.text}</span>
                      </div>

                      {doc.status === 'complete' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}

                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDoc && selectedDoc.data && (
        <Card variant="gradient" className="border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Extracted Data: {selectedDoc.name}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(null)}>
              Close
            </Button>
          </div>
          
          <div className="space-y-2">
            {Object.entries(selectedDoc.data.extractedFields as Record<string, string>).map(([key, value]) => (
              <div key={key} className="flex justify-between p-2 bg-slate-800/50 rounded">
                <span className="text-slate-400">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

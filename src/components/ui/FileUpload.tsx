'use client'

import { useState, useRef } from 'react'
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  PhotoIcon, 
  FilmIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

interface FileUploadProps {
  onUpload: (file: File, category: string, title: string) => Promise<void>
  category: string
  onClose: () => void
}

const documentCategories = [
  { value: 'CONTRACTS', label: 'Contrats', emoji: '📄', description: 'Contrats prestataires' },
  { value: 'INVOICES', label: 'Factures', emoji: '🧾', description: 'Factures et devis' },
  { value: 'INSPIRATION', label: 'Inspiration', emoji: '💡', description: 'Idées et moodboards' },
  { value: 'LEGAL_DOCUMENTS', label: 'Documents Légaux', emoji: '📋', description: 'Pièces officielles' },
  { value: 'PHOTOS', label: 'Photos', emoji: '📸', description: 'Photos et images' },
  { value: 'VIDEOS', label: 'Vidéos', emoji: '🎥', description: 'Vidéos et clips' },
  { value: 'OTHER', label: 'Autre', emoji: '📁', description: 'Autres documents' }
]

export default function FileUpload({ onUpload, category: defaultCategory, onClose }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState(defaultCategory || 'OTHER')
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    if (!title) {
      setTitle(file.name.split('.')[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      await onUpload(selectedFile, category, title)
      onClose()
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />
    } else if (file.type.startsWith('video/')) {
      return <FilmIcon className="h-8 w-8 text-purple-500" />
    } else {
      return <DocumentIcon className="h-8 w-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
              <CloudArrowUpIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Télécharger un Document</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Catégorie du document
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {documentCategories.map((cat) => (
                <label
                  key={cat.value}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    category === cat.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={(e) => setCategory(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-xs font-medium text-gray-900 text-center">{cat.label}</div>
                  <div className="text-xs text-gray-500 text-center">{cat.description}</div>
                </label>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive
                ? 'border-orange-500 bg-orange-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
            />
            
            {selectedFile ? (
              <div className="flex items-center space-x-4">
                {getFileIcon(selectedFile)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Type inconnu'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-orange-600 hover:text-orange-500">
                      Cliquez pour choisir un fichier
                    </span>{' '}
                    ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, JPG, PNG, MP4 jusqu'à 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Title Input */}
          {selectedFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du document
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Donnez un nom à votre document..."
                required
              />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Téléchargement...' : 'Télécharger'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import FileUpload from '@/components/ui/FileUpload'
import { 
  DocumentIcon, 
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  FilmIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface Document {
  id: string
  title: string
  fileName: string
  fileUrl: string
  fileType: string
  category: string
  uploadedAt: string
}

const categoryConfig = {
  'CONTRACTS': { label: 'Contrats', emoji: '📄', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  'INVOICES': { label: 'Factures', emoji: '🧾', color: 'bg-green-50 border-green-200 text-green-700' },
  'INSPIRATION': { label: 'Inspiration', emoji: '💡', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  'LEGAL_DOCUMENTS': { label: 'Documents Légaux', emoji: '📋', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  'PHOTOS': { label: 'Photos', emoji: '📸', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  'VIDEOS': { label: 'Vidéos', emoji: '🎥', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  'OTHER': { label: 'Autre', emoji: '📁', color: 'bg-gray-50 border-gray-200 text-gray-700' }
}

export default function DocumentsPage() {
  const { data: session } = useSession()
  const [documentsData, setDocumentsData] = useState<{
    documents: Document[]
    documentsByCategory: Record<string, Document[]>
    totalCount: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingDoc, setEditingDoc] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocumentsData(data)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File, category: string, title: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    formData.append('title', title)

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        await fetchDocuments()
        setUploadModalOpen(false)
      }
    } catch (error) {
      console.error('Error uploading document:', error)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchDocuments()
      }
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const handleEditTitle = async (docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle }),
      })

      if (response.ok) {
        await fetchDocuments()
        setEditingDoc(null)
        setEditTitle('')
      }
    } catch (error) {
      console.error('Error updating document:', error)
    }
  }

  const getFileIcon = (document: Document) => {
    if (document.fileType.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />
    } else if (document.fileType.startsWith('video/')) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!session) return null

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Filter documents based on search and category
  const filteredDocuments = documentsData?.documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const getCategoryStats = () => {
    return Object.entries(categoryConfig).map(([key, config]) => ({
      key,
      label: config.label,
      emoji: config.emoji,
      count: documentsData?.documentsByCategory[key]?.length || 0
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Mes documents</h1>
                <p className="text-orange-100 mt-1">
                  Organisez vos contrats, inspirations et documents de mariage
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{documentsData?.totalCount || 0}</div>
              <div className="text-orange-100">documents</div>
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {getCategoryStats().map((stat) => (
            <button
              key={stat.key}
              onClick={() => setSelectedCategory(selectedCategory === stat.key ? 'all' : stat.key)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCategory === stat.key
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className="text-sm font-medium text-gray-900">{stat.label}</div>
              <div className="text-lg font-bold text-orange-600">{stat.count}</div>
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Rechercher dans vos documents..."
            />
          </div>
          
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nouveau Document</span>
          </button>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => {
              const config = categoryConfig[document.category as keyof typeof categoryConfig]
              return (
                <div key={document.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Document Preview */}
                  <div className="aspect-video bg-gray-50 flex items-center justify-center relative group">
                    {document.fileType.startsWith('image/') ? (
                      <img
                        src={document.fileUrl}
                        alt={document.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        {getFileIcon(document)}
                        <span className="text-xs text-gray-500 mt-2 uppercase">
                          {document.fileType.split('/')[1] || 'Document'}
                        </span>
                      </div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => window.open(document.fileUrl, '_blank')}
                        className="p-2 bg-white rounded-lg text-gray-600 hover:text-blue-500"
                        title="Voir"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <a
                        href={document.fileUrl}
                        download={document.fileName}
                        className="p-2 bg-white rounded-lg text-gray-600 hover:text-green-500"
                        title="Télécharger"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="p-2 bg-white rounded-lg text-gray-600 hover:text-red-500"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Document Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                        {config.emoji} {config.label}
                      </span>
                    </div>
                    
                    {editingDoc === document.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          onBlur={() => handleEditTitle(document.id)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditTitle(document.id)
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer group"
                        onClick={() => {
                          setEditingDoc(document.id)
                          setEditTitle(document.title)
                        }}
                      >
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {document.title}
                        </h4>
                        <PencilIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500 mb-2">{document.fileName}</p>
                    <p className="text-xs text-gray-400">
                      Ajouté le {formatDate(document.uploadedAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Aucun document trouvé' 
                : 'Aucun document'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Commencez à organiser vos documents de mariage'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600"
              >
                Télécharger votre premier document
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <FileUpload
          onUpload={handleUpload}
          category={selectedCategory !== 'all' ? selectedCategory : 'OTHER'}
          onClose={() => setUploadModalOpen(false)}
        />
      )}
    </DashboardLayout>
  )
}
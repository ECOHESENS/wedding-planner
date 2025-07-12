import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { DocumentCategory } from '@prisma/client'
import mimeTypes from 'mime-types'
import { asyncErrorHandler, AuthenticationError, NotFoundError, FileUploadError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'

// Security configuration
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'text/plain'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt']

function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts and dangerous characters
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/\.\./g, '')
    .replace(/^\./, '')
    .substring(0, 100)
}

function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { isValid: false, error: `File type ${file.type} not allowed` }
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: `File extension .${extension} not allowed` }
  }

  // Additional MIME type validation
  const expectedMimeType = mimeTypes.lookup(extension)
  if (expectedMimeType && expectedMimeType !== file.type) {
    return { isValid: false, error: 'File type and extension mismatch' }
  }

  return { isValid: true }
}

async function handleDocumentUpload(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new AuthenticationError('Authentication required')
  }

  logger.apiRequest('POST', '/api/documents/upload', session.user.id)

  // Find the user's couple
  const couple = await prisma.couple.findFirst({
    where: {
      OR: [
        { brideId: session.user.id },
        { groomId: session.user.id }
      ]
    }
  })

  if (!couple) {
    throw new NotFoundError('No couple profile found')
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const category = formData.get('category') as string
  const title = formData.get('title') as string

  if (!file) {
    throw new FileUploadError('No file uploaded')
  }

  // Validate file
  const validation = validateFile(file)
  if (!validation.isValid) {
    throw new FileUploadError(validation.error!)
  }

  // Validate category
  if (category && !Object.values(DocumentCategory).includes(category as DocumentCategory)) {
    throw new ValidationError('Invalid document category')
  }

  // Validate title
  if (title && title.length > 255) {
    throw new ValidationError('Title too long (max 255 characters)')
  }

  // Create uploads directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', couple.id)
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    logger.error('Error creating upload directory', { error, coupleId: couple.id })
    throw new FileUploadError('Failed to create upload directory')
  }

  // Generate secure filename
  const timestamp = Date.now()
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const sanitizedName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''))
  const fileName = `${timestamp}-${sanitizedName}.${fileExtension}`
  const filePath = join(uploadDir, fileName)
  const fileUrl = `/uploads/${couple.id}/${fileName}`

  // Validate file path is within expected directory (prevent path traversal)
  if (!filePath.startsWith(uploadDir)) {
    throw new ValidationError('Invalid file path')
  }

  try {
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
  } catch (error) {
    logger.error('Error saving file', { error, filePath, coupleId: couple.id })
    throw new FileUploadError('Failed to save file')
  }

  // Save document info to database
  const document = await prisma.document.create({
    data: {
      title: title || sanitizedName,
      fileName: fileName,
      fileUrl,
      fileType: file.type,
      category: (category as DocumentCategory) || 'OTHER',
      coupleId: couple.id
    }
  })

  logger.info('Document uploaded successfully', { 
    documentId: document.id, 
    coupleId: couple.id,
    fileName: fileName,
    fileType: file.type 
  })

  return NextResponse.json({
    ...document,
    message: 'File uploaded successfully'
  })
}

export const POST = asyncErrorHandler(handleDocumentUpload)
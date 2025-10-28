import { useState, useCallback } from 'react'

export default function TranscriptUploader({ onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  // Validate file type and size
  const validateFile = (file) => {
    setError(null)

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file format. Please upload JPG, PNG, or PDF only.')
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 10MB.')
      return false
    }

    return true
  }

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!validateFile(file)) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setSuccess(false)
  }

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  // Handle file input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // Handle camera capture (mobile)
  const handleCameraCapture = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  // Upload file to API
  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      // TODO: Get userId from auth context
      formData.append('userId', 'user123')

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/upload-transcript', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(true)
      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete(data.courses || [])
        }
      }, 1000)

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  // Clear selection
  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    setSuccess(false)
    setUploadProgress(0)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Your Transcript</h2>

      {!previewUrl ? (
        <>
          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg mb-2">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">JPG, PNG, or PDF (max 10MB)</p>
          </div>

          {/* Hidden file inputs */}
          <input
            id="file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          {/* Camera button (mobile) */}
          <div className="mt-4 flex justify-center">
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer md:hidden">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </label>
          </div>
        </>
      ) : (
        <>
          {/* Preview Section */}
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">Selected File:</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedFile?.name}</p>

            {selectedFile?.type.startsWith('image/') && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded border"
              />
            )}

            {selectedFile?.type === 'application/pdf' && (
              <div className="bg-gray-100 p-8 rounded text-center">
                <svg
                  className="mx-auto h-16 w-16 text-red-500 mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-gray-600">PDF Document</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading || success}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                uploading || success
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {uploading ? 'Uploading...' : success ? 'Uploaded!' : 'Upload Transcript'}
            </button>
            <button
              onClick={handleClear}
              disabled={uploading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Upload successful! Processing your transcript...
        </div>
      )}
    </div>
  )
}

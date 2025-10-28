import { useState } from 'react'

export default function ImagePreview({ imageUrl, onConfirm, onRetake }) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1))
  }

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90)
  }

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Preview Your Transcript</h2>

      {/* Image Display Container */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6 overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px] max-h-[600px] overflow-auto">
          <img
            src={imageUrl}
            alt="Transcript Preview"
            className="transition-transform duration-200 ease-in-out"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Zoom:</span>
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom out"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Zoom in"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
          </div>

          {/* Rotation Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Rotate:</span>
            <button
              onClick={handleRotateLeft}
              className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Rotate left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
            <span className="text-sm font-medium min-w-[3rem] text-center">
              {((rotation % 360) + 360) % 360}°
            </span>
            <button
              onClick={handleRotateRight}
              className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Rotate right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                />
              </svg>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetake}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retake Photo
          </span>
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Use This Image
          </span>
        </button>
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Make sure your transcript is clearly visible and all text is readable.
          You can zoom and rotate the image to check the quality before uploading.
        </p>
      </div>
    </div>
  )
}

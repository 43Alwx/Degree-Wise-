# Photo Upload Interface - Tasks for Gigi

## 1. Photo Upload Interface (1-2 hours)

### Components to Build:

---

## `components/TranscriptUploader.js`

### Features Required:
- Drag & drop zone for file upload
- Click to browse files
- Image preview before upload
- File validation (only images: JPG, PNG, PDF)
- Upload progress indicator
- Success/error messages

### Component Structure:
```javascript
import { useState } from 'react'

export default function TranscriptUploader({ onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  // TODO: Implement drag & drop handlers
  // TODO: Implement file validation
  // TODO: Implement upload to API

  return (
    <div>
      {/* Drag & drop zone */}
      {/* File browser button */}
      {/* Camera button (mobile only) */}
      {/* Upload progress */}
      {/* Error messages */}
    </div>
  )
}
```

### Acceptance Criteria:
- [ ] User can drag and drop image files
- [ ] User can click to browse and select files
- [ ] Only JPG, PNG, PDF files are accepted
- [ ] Shows error message for invalid file types
- [ ] Shows upload progress (0-100%)
- [ ] Mobile users can access camera
- [ ] Clean, intuitive UI with Tailwind CSS

---

## `components/ImagePreview.js`

### Features Required:
- Show uploaded image
- Zoom/rotate controls
- Crop tool (optional - can be Phase 2)
- "Use this image" button
- "Retake" button

### Component Structure:
```javascript
export default function ImagePreview({ imageUrl, onConfirm, onRetake }) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  // TODO: Implement zoom controls
  // TODO: Implement rotation controls
  // TODO: Implement crop (optional)

  return (
    <div>
      {/* Image display with zoom/rotate */}
      {/* Zoom controls (+/-) */}
      {/* Rotate controls */}
      {/* Action buttons */}
    </div>
  )
}
```

### Acceptance Criteria:
- [ ] Displays uploaded image clearly
- [ ] User can zoom in/out (1x to 3x)
- [ ] User can rotate image (90° increments)
- [ ] "Use this image" button triggers upload
- [ ] "Retake" button clears image and goes back
- [ ] Responsive design (works on mobile/tablet/desktop)

---

## Upload Flow (What Gigi Needs to Know):

### Step-by-Step Process:

```javascript
// 1. User uploads image → store in state
const handleFileSelect = (file) => {
  setSelectedFile(file)
  setPreviewUrl(URL.createObjectURL(file))
}

// 2. Show preview
// Display ImagePreview component with preview URL

// 3. On confirm → send to API endpoint: POST /api/upload-transcript
const handleConfirm = async () => {
  const formData = new FormData()
  formData.append('image', selectedFile)
  formData.append('userId', userId) // Get from auth context

  const response = await fetch('/api/upload-transcript', {
    method: 'POST',
    body: formData
  })

  const data = await response.json()
  return data
}

// 4. API returns extracted courses (or placeholder for now)
// Expected response:
{
  success: true,
  courses: [
    { code: 'CS1050', name: 'Computer Science 1', semester: 'Fall 2023', grade: 'A' },
    { code: 'MTH1410', name: 'Calculus I', semester: 'Fall 2023', grade: 'B+' }
  ],
  imageUrl: 'https://...' // Stored image URL
}

// 5. Show review screen
// Pass extracted courses to CourseReviewTable component
```

---

## File Structure:

```
components/
├── TranscriptUploader.js    ← Main upload component
├── ImagePreview.js           ← Preview and confirmation
└── CourseReviewTable.js      ← Review extracted courses (separate task)
```

---

## Integration with Dashboard:

In `pages/dashboard.js`, the TranscriptTab should use these components:

```javascript
function TranscriptTab() {
  const [uploadMethod, setUploadMethod] = useState('photo')
  const [extractedCourses, setExtractedCourses] = useState(null)

  const handleUploadComplete = (courses) => {
    setExtractedCourses(courses)
    // Show CourseReviewTable
  }

  return (
    <div>
      {!extractedCourses ? (
        <TranscriptUploader onUploadComplete={handleUploadComplete} />
      ) : (
        <CourseReviewTable courses={extractedCourses} />
      )}
    </div>
  )
}
```

---

## Styling Guidelines:

### Use Tailwind classes for consistency:

**Drag & Drop Zone:**
```jsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-accent transition-colors cursor-pointer">
  {/* Content */}
</div>
```

**Upload Button:**
```jsx
<button className="btn-primary">
  Upload Transcript
</button>
```

**Error Message:**
```jsx
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  {error}
</div>
```

**Success Message:**
```jsx
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
  Upload successful!
</div>
```

---

## Testing Checklist:

### Desktop Testing:
- [ ] Drag and drop image works
- [ ] Click to browse works
- [ ] Preview shows correctly
- [ ] Zoom/rotate controls work
- [ ] Upload progress displays
- [ ] Error handling works

### Mobile Testing:
- [ ] Camera access button appears
- [ ] File picker works on mobile
- [ ] Touch controls work for zoom/rotate
- [ ] Responsive layout looks good
- [ ] Upload works on cellular connection

### Edge Cases:
- [ ] File too large (>10MB) - show error
- [ ] Wrong file type (.doc, .txt) - show error
- [ ] Network error during upload - show error
- [ ] Cancel during upload - handle cleanup

---

## Dependencies Needed:

```bash
# If using advanced image manipulation:
npm install react-image-crop  # For cropping (optional)
npm install react-zoom-pan-pinch  # For zoom controls (optional)
```

**OR** use native CSS transforms (lighter weight):
```javascript
// Zoom with CSS
<img style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }} />
```

---

## API Endpoint Format (Alex will create this):

### Request:
```
POST /api/upload-transcript
Content-Type: multipart/form-data

Body:
- image: File (JPG/PNG/PDF)
- userId: String
```

### Response:
```json
{
  "success": true,
  "courses": [
    {
      "code": "CS1050",
      "name": "Computer Science 1",
      "semester": "Fall 2023",
      "grade": "A",
      "credits": 4
    }
  ],
  "imageUrl": "https://storage.supabase.co/...",
  "message": "OCR processing complete"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Invalid file format. Please upload JPG, PNG, or PDF only."
}
```

---

## Timeline:

**Phase 1 (Now):**
- Build TranscriptUploader component (1 hour)
- Build ImagePreview component (1 hour)
- Basic file validation and upload (30 min)

**Phase 2 (After Alex finishes API):**
- Connect to real API endpoint
- Test with actual uploads
- Handle extracted course data

**Phase 3 (Future):**
- Add OCR functionality (backend)
- Improve image preprocessing
- Add crop tool

---

## Questions for Alex:

1. What's the API endpoint URL? (e.g., `/api/upload-transcript`)
2. What's the max file size allowed?
3. Where will images be stored? (Supabase Storage? Vercel Blob?)
4. Will OCR be ready in Phase 1, or should I show a placeholder?
5. What's the userId format? (Get from session/auth context?)

---

## Priority:

🔴 **High Priority:**
- TranscriptUploader drag & drop
- File validation
- Basic upload functionality

🟡 **Medium Priority:**
- ImagePreview with zoom/rotate
- Upload progress indicator
- Error handling

🟢 **Low Priority (Nice to Have):**
- Crop tool
- Advanced zoom controls
- Camera access on mobile

---

## Need Help?

- Tailwind CSS: https://tailwindcss.com/docs
- File Upload in React: https://react.dev/reference/react-dom/components/input#reading-the-files-information-without-uploading-them-to-the-server
- FormData API: https://developer.mozilla.org/en-US/docs/Web/API/FormData

---

Good luck, Gigi! Let Alex know when you're ready to integrate with the API. 🚀

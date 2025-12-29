# FundooNotes API Documentation

## Base URL
```
http://localhost:4000/api/v1
```

## Authentication
All note endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. User Registration
```http
POST /signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

### 2. User Login
```http
POST /login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

---

## 📝 Basic Note Operations

### 1. Create Note
```http
POST /notes
```

**Request Body:**
```json
{
  "title": "My First Note",
  "description": "This is the content of my note",
  "labels": ["work", "important"],
  "color": "#ffeb3b",
  "reminder": "2024-12-31T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "note_id",
    "title": "My First Note",
    "description": "This is the content of my note",
    "userId": "user_id",
    "labels": ["work", "important"],
    "color": "#ffeb3b",
    "isPinned": false,
    "isArchived": false,
    "isDeleted": false,
    "collaborators": [],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Get All Notes (Cached - Initial 20)
```http
GET /notes
```

**Response:**
```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "cached": false,
  "count": 5,
  "notes": [
    {
      "_id": "note_id",
      "title": "My First Note",
      "description": "This is the content",
      "labels": ["work"],
      "isPinned": true,
      "isArchived": false,
      "isDeleted": false,
      "collaborators": [],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 3. Update Note
```http
PUT /notes/:noteId
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated content",
  "color": "#4caf50"
}
```

---

## 📂 Part III: Archive, Trash, Pin, Label Features

### 1. Get Archived Notes
```http
GET /notes/archived
```

**Response:**
```json
{
  "success": true,
  "message": "Archived notes retrieved successfully",
  "cached": false,
  "count": 3,
  "notes": [...]
}
```

### 2. Get Trash Notes
```http
GET /notes/trash
```

### 3. Get Pinned Notes
```http
GET /notes/pinned
```

### 4. Toggle Archive Status
```http
PUT /notes/:noteId/archive
```

**Response:**
```json
{
  "success": true,
  "message": "Note archived successfully",
  "note": {
    "_id": "note_id",
    "isArchived": true,
    "isPinned": false
  }
}
```

### 5. Toggle Pin Status
```http
PUT /notes/:noteId/pin
```

**Response:**
```json
{
  "success": true,
  "message": "Note pinned successfully",
  "note": {
    "_id": "note_id",
    "isPinned": true,
    "isArchived": false
  }
}
```

### 6. Update Labels
```http
PUT /notes/:noteId/labels
```

**Request Body:**
```json
{
  "labels": ["work", "urgent", "meeting"]
}
```

### 7. Move to Trash
```http
PUT /notes/:noteId/trash
```

**Response:**
```json
{
  "success": true,
  "message": "Note moved to trash successfully",
  "note": {
    "_id": "note_id",
    "isDeleted": true,
    "isPinned": false,
    "isArchived": false
  }
}
```

### 8. Restore from Trash
```http
PUT /notes/:noteId/restore
```

### 9. Permanent Delete
```http
DELETE /notes/:noteId/permanent
```

---

## 🔍 Part IV: Search & Collaboration Features

### 1. Search Notes
```http
GET /notes/search?query=meeting&labels=work,urgent
```

**Query Parameters:**
- `query` (optional): Text to search in title and description
- `labels` (optional): Comma-separated list of labels

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "count": 2,
  "searchQuery": "meeting",
  "searchLabels": "work,urgent",
  "notes": [...]
}
```

### 2. Add Collaborator
```http
POST /notes/:noteId/collaborators
```

**Request Body:**
```json
{
  "email": "collaborator@example.com",
  "permission": "write"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Collaborator added successfully",
  "note": {
    "_id": "note_id",
    "collaborators": [
      {
        "_id": "collab_id",
        "userId": "user_id",
        "email": "collaborator@example.com",
        "permission": "write",
        "addedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**Email Notification:** An email will be sent to the collaborator with note details.

### 3. Remove Collaborator
```http
DELETE /notes/:noteId/collaborators/:collaboratorId
```

### 4. Get Shared Notes
```http
GET /notes/shared
```

**Response:**
```json
{
  "success": true,
  "message": "Shared notes retrieved successfully",
  "count": 2,
  "notes": [
    {
      "_id": "note_id",
      "title": "Shared Note",
      "userId": {
        "_id": "owner_id",
        "name": "Note Owner",
        "email": "owner@example.com"
      },
      "collaborators": [...]
    }
  ]
}
```

---

## 📊 Caching Strategy

### Cache Keys:
- `notes:userId:all` - All active notes (1 hour)
- `notes:userId:archived` - Archived notes (30 minutes)
- `notes:userId:trash` - Trash notes (15 minutes)
- `notes:userId:pinned` - Pinned notes (30 minutes)

### Cache Invalidation:
Cache is automatically invalidated when:
- Creating a new note
- Updating any note
- Changing note status (pin/archive/delete)
- Adding/removing collaborators

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Title and description are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is invalid"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Note not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create note"
}
```

---

## 📧 Email Notifications

### Collaboration Email Template:
When a user is added as a collaborator, they receive an email with:
- Note title and preview
- Permission level (read/write)
- Labels (if any)
- Sender information

---

## 🧪 Testing Examples

### Using cURL:

**1. Create a note:**
```bash
curl -X POST http://localhost:4000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Note",
    "description": "This is a test note",
    "labels": ["test", "api"]
  }'
```

**2. Search notes:**
```bash
curl -X GET "http://localhost:4000/api/v1/notes/search?query=test&labels=api" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. Add collaborator:**
```bash
curl -X POST http://localhost:4000/api/v1/notes/NOTE_ID/collaborators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "email": "friend@example.com",
    "permission": "write"
  }'
```

---

## 📈 Performance Features

1. **Redis Caching**: Initial 20 notes cached per user
2. **Database Indexing**: Optimized for search and filtering
3. **Pagination**: Limited results to prevent overload
4. **Efficient Queries**: Optimized MongoDB queries with proper indexes

---

## 🔧 Environment Variables Required

```env
PORT=4000
MONGODB_URL=mongodb://localhost:27017/FundooDatabase
JWT_SECRET=your_jwt_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

This API provides a complete backend solution for the FundooNotes application with advanced features like caching, search, collaboration, and email notifications.